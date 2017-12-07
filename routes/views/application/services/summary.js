var keystone = require('keystone');
var Application = keystone.list('Application');
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
			.where('_id', locals.filters.application).populate({ path: 'framework', populate: { path: 'productTypesToInclude' } })
			.exec(function (err, app) {
				if (err) return res.err(err);
				if (!app) return res.notfound('Application not found');
				locals.application = app;
				next();
			});
	});

	// Render the view
	view.render('application/services/summary');
};
