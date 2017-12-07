var keystone = require('keystone');
var Application = keystone.list('Application');
var ProductType = keystone.list('ProductType');
exports = module.exports = function (req, res) {

	if (!req.user) {
		return res.redirect('/');
	}

	var view = new keystone.View(req, res);
	var locals = res.locals;
	locals.filters = {
		application: req.params.application,
		productType: req.params.type,
	};

	view.on('init', function (next) {
		Application.model.findOne()
			.where('_id', locals.filters.application).populate('products') // .populate({ path: 'framework', populate: { path: 'productTypesToInclude' } })
			.exec(function (err, app) {
				if (err) return res.err(err);
				if (!app) return res.notfound('Application not found');
				locals.application = app;
				next();
			});
	});

	view.on('init', function (next) {
		ProductType.model.findOne()
			.where('_id', locals.filters.productType)
			.exec(function (err, pt) {
				if (err) return res.err(err);
				if (!pt) return res.notfound('Product type not found');
				locals.productType = pt;
				next();
			});
	});

	// Render the view
	view.render('application/services/byType');
};
