var keystone = require('keystone');
var Product = keystone.list('Product');
var Attribute = keystone.list('Attribute');
var AttributeValue = keystone.list('AttributeValue');
exports = module.exports = function (req, res) {

	if (!req.user) {
		return res.redirect('/');
	}

	var view = new keystone.View(req, res);
	var locals = res.locals;
	locals.filters = {
		product: req.params.product,
		attribute: req.params.attribute,
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

	view.on('init', function (next) {
		Attribute.model.findOne()
			.where('_id', locals.filters.attribute)
			.exec(function (err, att) {
				if (err) return res.err(err);

				locals.attribute = att;
				next();
			});
	});

	view.on('init', function (next) {
		AttributeValue.model.findOne()
			.where('attribute', locals.attribute)
			.where('product', locals.product)
			.exec(function (err, attValue) {
				if (err) return res.err(err);

				locals.attributeValue = attValue;
				next();
			});
	});

	view.on('post', { action: 'update' }, function (next) {
		var updater;
		if (locals.attributeValue) {
			updater = locals.attributeValue.getUpdateHandler(req);
		} else {
			var newValue = new AttributeValue.model();
			newValue.product = locals.product;
			newValue.attribute = locals.attribute;
			updater = newValue.getUpdateHandler(req);
		}

		var vField = 'value';
		if (locals.attribute.questionType === 'checkboxOptions') {
			vField = 'valueTextArray';
		}

		updater.process(req.body, {
			flashErrors: true,
			fields: vField, // need custom error handling, this isn't going to cut it
			errorMessage: 'Something went wrong updating this field',
		}, function (err) {
			if (err) {
				locals.validationErrors = err.errors;
			} else {
				return res.redirect('/application/services/' + locals.product.application.id + '/service/' + locals.product.id);
			}
			next();
		});

	});
	// Render the view
	view.render('application/services/fields/customAttribute');
};
