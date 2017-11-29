var keystone = require('keystone');
var Opportunity = keystone.list('Opportunity');
var AttributeValue = keystone.list('AttributeValue');
var EvaluationCriteriaValue = keystone.list('EvaluationCriteriaValue');
exports = module.exports = function (req, res) {

	if (!req.user) {
		return res.redirect('/');
	}

	var view = new keystone.View(req, res);
	var locals = res.locals;
	locals.filters = {
		opportunity: req.params.opportunity,
	};

	view.on('init', function (next) {
		Opportunity.model.findOne()
			.where('_id', locals.filters.opportunity).populate('productType')
			.populate({ path: 'configurationAtCreation', populate: { path: 'detailedRequirements' } })
			.populate({ path: 'configurationAtCreation', populate: { path: 'evaluationCriteria', populate: { path: 'childCriteria' } } })
			.exec(function (err, opp) {
				if (err) return res.err(err);
				if (!opp) return res.notfound('Opportunity not found');

				locals.opportunity = opp;
				if (req.user._id.toString() !== opp.createdBy.toString()) return res.redirect('/');
				next();
			});
	});

	// Next: work out what still needs doing.
	// !! all below functionality should be in the model or a service layer.  Not here!!
	view.on('init', function (next) {
		AttributeValue.model.find()
			.where('opportunity', locals.filters.opportunity)
			.exec(function (err, oppValues) {
				if (err) return res.err(err);
				locals.opportunityAttributeValues = oppValues;

				locals.incompleteAttributes = [];
				var req = locals.opportunity.configurationAtCreation.detailedRequirements;
				if (!req) next();
				for (var i = 0; i < req.length; i++) {
					var v = locals.opportunityAttributeValues.find(o => o.attribute.toString() === req[i].id.toString()); // or use == but that's risky
					if (!v) locals.incompleteAttributes.push(v);
					else if (req[i].required && v === '') locals.incompleteAttributes.push(v);
				}
				next();
			});
	});
	view.on('init', function (next) {
		EvaluationCriteriaValue.model.find()
			.where('opportunity', locals.filters.opportunity)
			.exec(function (err, evValues) {
				if (err) return res.err(err);
				locals.evaluationCriteriaValues = evValues;

				locals.incompleteEvaluationCriteria = [];
				var ecs = locals.opportunity.configurationAtCreation.evaluationCriteria;
				if (!ecs) next();
				for (var i = 0; i < ecs.length; i++) {
					if (checkIncompleteCriteria(locals.evaluationCriteriaValues, ecs[i])) {
						locals.incompleteEvaluationCriteria.push(ecs[i]);
					}
					if (ecs[i].childCriteria.length > 0) {
						// only one level of nesting so no need to recurse
						for (var c = 0; c < ecs[i].childCriteria.length; c++) {
							if (checkIncompleteCriteria(locals.evaluationCriteriaValues, ecs[i].childCriteria[c])) {
								locals.incompleteEvaluationCriteria.push(ecs[i].childCriteria[c]);
							}
						}
					}
				}
				next();
			});
	});

	view.on('init', function (next) {
		locals.isReadyToPublish = false;
		if (!locals.opportunity.basicsComplete) { next(); return; }
		if (!locals.opportunity.evaluationBasicsComplete) { next(); return; }
		if (locals.incompleteAttributes.length > 0) { next(); return; }
		if (locals.incompleteEvaluationCriteria.length > 0) { next(); return; }
		if (locals.opportunity.configurationAtCreation.howLongOpenForOptions) {
			if (locals.opportunity.configurationAtCreation.howLongOpenForOptions.length > 1) {
				if (locals.opportunity.howLongOpenFor) locals.isReadyToPublish = true;
				else { next(); return; }
			} else locals.isReadyToPublish = true;
		} else locals.isReadyToPublish = true;
		next();
	});

	// Render the view
	view.render('opportunity/summary');
};

function checkIncompleteCriteria (myValues, myCriteria) {
	var v = myValues.find(o => o.evaluationCriteria.toString() === myCriteria.id.toString());
	if (!v) return true;
	else if (v.weighting === 0 || (myCriteria.canAddCriteriaLines && v.criteriaLines.length < 2)) { // yuck! remove this param
		return true;
	}
	return false;
}
