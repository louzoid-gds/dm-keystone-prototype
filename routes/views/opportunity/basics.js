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
		field: req.params.field,
	};

	view.on('init', function (next) {
		Opportunity.model.findOne()
			.where('_id', locals.filters.opportunity).populate('configurationAtCreation')
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
			// fields: 'title, description',
			fields: locals.filters.field,
			errorMessage: 'There was a problem updating this field',
		}, function (err) {
			if (err) {
				locals.validationErrors = err.errors;
			} else {
				var redirect = 'summary';
				if (req.body.redirectTo) redirect = req.body.redirectTo; // not cool in production
				return res.redirect('/opportunity/update/' + redirect + '/' + locals.opportunity.id);
			}
			next();
		});

	});
		
	// Render the view
	view.render('opportunity/fields/' + locals.filters.field);
};
