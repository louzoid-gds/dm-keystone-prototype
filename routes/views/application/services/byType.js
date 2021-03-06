var keystone = require('keystone');
var Application = keystone.list('Application');
var ProductType = keystone.list('ProductType');
var Product = keystone.list('Product');
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
			.where('_id', locals.filters.application).populate('framework') // .populate('products')
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

	view.on('init', function (next) {
		ProductType.model.findOne()
			.where('_id', locals.filters.productType)
			.exec(function (err, pt) {
				if (err) return res.err(err);
				if (!pt) return res.notfound('Product type not found');

				if (!pt.canAddMoreThanOneServiceOnApplication) {
					var redir = '/application/services/' + locals.application.id + '/service/';
					// check if product exists, if so redirect, if not, create and redirect
					var p = locals.products.find(o => o.productType.toString() === pt.id.toString());
					if (p) {
						return res.redirect(redir + p.id);
					}
					else {
						var newProd = new Product.model({
							createdBy: locals.user.id,
							application: locals.application,
							productType: pt,
							name: pt.name,
						});
						newProd.save(function (err) {
							if (err) return res.err(err.errors);
							else return res.redirect(redir + newProd.id);
						});
					}
				}
				else {
					locals.productType = pt;
					next();
				}
			});
	});

	view.on('init', function (next) {
		Product.model.find()
			.where('application', locals.application)
			.where('productType', locals.productType)
			.exec(function (err, products) {
				if (err) return res.err(err);
				locals.products = products;
				next();
			});
	});

	// view.on('post', { action: 'create' }, function (next) {

	// 	var newProd = new Product.model({
	// 		createdBy: locals.user.id,
	// 		application: locals.application,
	// 		productType: locals.productType,
	// 		name: '',
	// 	});
	// 	newProd.save(function (err) {
	// 		if (err) return res.err(err.errors);
	// 		else return res.redirect('/application/services/' + locals.application.id + '/service/' + newProd.id);
	// 	});

	// });

	// Render the view
	view.render('application/services/byType');
};
