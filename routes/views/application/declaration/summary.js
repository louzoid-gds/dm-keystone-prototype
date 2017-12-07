var keystone = require('keystone');
var Application = keystone.list('Application');
var AttributeValue = keystone.list('AttributeValue');
exports = module.exports = function (req, res) {

	if (!req.user) {
		return res.redirect('/');
	}

	var view = new keystone.View(req, res);
	var locals = res.locals;
	locals.filters = {
		application: req.params.application,
	};

	view.on('init', function (next) {
		Application.model.findOne()
			.where('_id', locals.filters.application)
			.populate({ path: 'framework', populate: { path: 'coreTermsVersionToUse',
				populate: { path: 'essentials groundsForMandatoryExclusion' } } })
			.exec(function (err, app) {
				if (err) return res.err(err);
				if (!app) return res.err('Application does not exist');
				if (req.user._id.toString() !== app.createdBy.toString()) return res.redirect('/');
				locals.application = app;
				next();
			});
	});

	view.on('init', function (next) {
		AttributeValue.model.find()
			.where('declaration', locals.application.declaration)
			.exec(function (err, values) {
				if (err) return res.err(err);

				locals.declarationValues = values;
				next();
			});
	});

	// Render the view
	view.render('application/declaration/summary');
};
