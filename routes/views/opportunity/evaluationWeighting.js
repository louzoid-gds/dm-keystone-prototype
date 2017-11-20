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
			.where('_id', locals.filters.opportunity).populate({ path: 'configurationAtCreation', populate: { path: 'evaluationCriteria' } })
			.exec(function (err, opp) {
				if (err) return res.err(err);
				if (!opp) return res.notfound('Opportunity not found');

				locals.opportunity = opp;
				if (req.user._id.toString() !== opp.createdBy.toString()) return res.redirect('/');
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

	view.on('post', { action: 'update' }, function (next) {

		var evs = locals.opportunity.configurationAtCreation.evaluationCriteria;
		if (!evs) next();
		var objs = [];
		for (var i = 0; i < evs.length; i++) {
			var weighting = req.body[evs[i].id + '-weighting'];
			// to do - check if valid!!
			objs.push({ ev: evs[i], weighting: weighting });
		}

		var updates = [];
		objs.forEach(function (item) {
			// this is dangerous and not cool for production
			var updatePromise = EvaluationCriteriaValue.model.findOneAndUpdate(
				{ evaluationCriteria: item.ev, opportunity: locals.opportunity },
				{ $set: { weighting: item.weighting, opportunity: locals.opportunity, evaluationCriteria: item.ev } },
				{ safe: true, upsert: true },
			);
			updates.push(updatePromise);
		});

		Promise.all(updates).then(function (results) {
			// console.log(results);
			return res.redirect('/opportunity/update/evaluationSummary/' + locals.opportunity.id);
		}).catch(function (err) {
			locals.validationErrors = err;
			next();
		});

	});

	// Render the view
	view.render('opportunity/fields/evaluationWeighting');
};
