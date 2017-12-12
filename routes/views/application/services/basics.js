var keystone = require('keystone');
var Product = keystone.list('Product');
exports = module.exports = function (req, res) {

	if (!req.user) {
		return res.redirect('/');
	}

	var view = new keystone.View(req, res);
	var locals = res.locals;
	locals.filters = {
		product: req.params.product,
		field: req.params.field,
	};

	view.on('init', function (next) {
		Product.model.findOne()
		.where('_id', locals.filters.product).populate({ path: 'application', populate: { path: 'framework' } })
		.populate({ path: 'productType', populate: { path: 'attributeGroups', populate: { path: 'attributes' } } })
			.exec(function (err, p) {
				if (err) return res.err(err);
				if (!p) return res.notfound('Product not found');

				locals.product = p;
				if (req.user._id.toString() !== p.application.createdBy.toString()) return res.redirect('/');
				next();
			});
	});

	view.on('post', { action: 'update' }, function (next) {
		var updater = locals.product.getUpdateHandler(req);
		updater.process(req.body, {
			flashErrors: true,
			fields: locals.filters.field,
			errorMessage: 'There was a problem updating this field',
		}, function (err) {
			if (err) {
				locals.validationErrors = err.errors;
			} else {
				// var redirect = 'summary';
				// if (req.body.redirectTo) redirect = req.body.redirectTo; // not cool in production
				return res.redirect('/application/services/' + locals.product.application.id + '/service/' + locals.product.id);
			}
			next();
		});

	});

	// Render the view
	view.render('application/services/fields/' + locals.filters.field);
};
