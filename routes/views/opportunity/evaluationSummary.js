var keystone = require('keystone');
var Opportunity = keystone.list('Opportunity');
var EvaluationCriteriaValue = keystone.list('EvaluationCriteriaValue');
exports = module.exports = function (req, res) {

	if (!req.user) {
		return res.redirect('/'); 
	}

	var view = new keystone.View(req, res);
	var locals = res.locals;
	locals.filters = {
		opportunity: req.params.opportunity
	};

	view.on('init', function (next) {
		Opportunity.model.findOne()
			.where('_id', locals.filters.opportunity).populate({ path: 'configurationAtCreation', populate: { path: 'evaluationCriteria', populate: { path: 'childCriteria' } } })
			.exec(function (err, opp) {
				if (err) return res.err(err);
				if (!opp) return res.notfound('Opportunity not found');

				locals.opportunity = opp;
				next();
			});
	});

	view.on('init', function (next) {
		EvaluationCriteriaValue.model.find()
			.where('opportunity', locals.filters.opportunity)
			.exec(function (err, evValues) {
				if (err) return res.err(err);

				locals.evaluationCriteriaValues = evValues;
				next();
			});
	});

	// Render the view
	view.render('opportunity/evaluationSummary');
};
