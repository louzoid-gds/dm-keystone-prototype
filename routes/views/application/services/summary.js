var keystone = require('keystone');
var Application = keystone.list('Application');
var Product = keystone.list('Product');
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
				if (req.user._id.toString() !== app.createdBy.toString()) return res.redirect('/');
				locals.application = app;
				next();
			});
	});

	view.on('init', function (next) {
		Product.model.find()
			.where('application', locals.filters.application)
			.exec(function (err, products) {
				if (err) return res.err(err);
				locals.products = products;
				next();
			});
	});

	// Render the view
	view.render('application/services/summary');
};
