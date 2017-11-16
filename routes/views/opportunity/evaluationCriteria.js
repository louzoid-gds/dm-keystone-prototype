var keystone = require('keystone');
var Opportunity = keystone.list('Opportunity');
var EvaluationCriteria = keystone.list('EvaluationCriteria');
var EvaluationCriteriaValue = keystone.list('EvaluationCriteriaValue');

exports = module.exports = function (req, res) {

	if (!req.user) {
		return res.redirect('/');
	}

	var view = new keystone.View(req, res);
	var locals = res.locals;
	locals.filters = {
		opportunity: req.params.opportunity,
		evaluationCriteria: req.params.evaluationCriteria,
	};

	view.on('init', function (next) {
		Opportunity.model.findOne()
			.where('_id', locals.filters.opportunity)
			.exec(function (err, opp) {
				if (err) return res.err(err);
				if (!opp) return res.notfound('Opportunity not found');

				locals.opportunity = opp;
				next();
			});
	});

	view.on('init', function (next) {
		EvaluationCriteria.model.findOne()
			.where('_id', locals.filters.evaluationCriteria)
			.exec(function (err, att) {
				if (err) return res.err(err);

				locals.evaluationCriteria = att;
				next();
			});
	});

	view.on('init', function (next) {
		EvaluationCriteriaValue.model.findOne()
			.where('evaluationCriteria', locals.evaluationCriteria)
			.where('opportunity', locals.opportunity)
			.exec(function (err, attValue) {
				if (err) return res.err(err);

				locals.evaluationCriteriaValue = attValue;
				next();
			});
	});

	view.on('post', { action: 'update' }, function (next) {
		var updater;
		if (locals.evaluationCriteriaValue) {
			updater = locals.evaluationCriteriaValue.getUpdateHandler(req);
		} else {
			var newValue = new EvaluationCriteriaValue.model();
			newValue.opportunity = locals.opportunity;
			newValue.evaluationCriteria = locals.evaluationCriteria;
			updater = newValue.getUpdateHandler(req);
		}

		updater.process(req.body, {
			flashErrors: true,
			fields: 'criteriaLines',
			errorMessage: 'Something went wrong updating this field',
		}, function (err) {
			if (err) {
				locals.validationErrors = err.errors;
			} else {
				return res.redirect('/opportunity/update/evaluationSummary/' + locals.opportunity.id);
			}
			next();
		});

	});
	// Render the view
	view.render('opportunity/fields/evaluationCriteria');
};
