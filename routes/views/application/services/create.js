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
		ProductType.model.findOne()
			.where('_id', locals.filters.productType)
			.exec(function (err, pt) {
				if (err) return res.err(err);
				if (!pt) return res.notfound('Product type not found');
				locals.productType = pt;
				next();
			});
	});

	view.on('post', { action: 'create' }, function (next) {
		var newProd = new Product.model({
			createdBy: locals.user.id,
			application: locals.application,
			productType: locals.productType,
		});
		var updater = newProd.getUpdateHandler(req);

		updater.process(req.body, {
			flashErrors: true,
			fields: 'name',
			errorMessage: 'There was a problem creating your service',
		}, function (err) {
			if (err) {
				locals.validationErrors = err.errors;
			} else {
				return res.redirect('/application/services/' + locals.application.id + '/service/' + newProd.id);
			}
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
	view.render('application/services/create');
};
