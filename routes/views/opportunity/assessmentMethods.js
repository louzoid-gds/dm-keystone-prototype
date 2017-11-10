var keystone = require('keystone');
var Opportunity = keystone.list('Opportunity');

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
			.where('_id', locals.filters.opportunity).populate({ path: 'configurationAtCreation', populate: { path: 'assessmentMethodsAvailable' } })
			.exec(function (err, opp) {
				if (err) return res.err(err);
				if (!opp) return res.notfound('Opportunity not found');

				locals.opportunity = opp;
				next();
			});
	});

	view.on('post', { action: 'update' }, function (next) {
		var updater = locals.opportunity.getUpdateHandler(req);

		updater.process(req.body, {
			flashErrors: true,
			fields: 'assessmentMethods',
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
	view.render('opportunity/fields/assessmentMethods');
};
