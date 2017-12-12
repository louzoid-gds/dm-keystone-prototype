var keystone = require('keystone');
var Product = keystone.list('Product');
var AttributeValue = keystone.list('AttributeValue');
exports = module.exports = function (req, res) {

	if (!req.user) {
		return res.redirect('/');
	}

	var view = new keystone.View(req, res);
	var locals = res.locals;
	locals.filters = {
		application: req.params.application,
		product: req.params.product,
	};

	view.on('init', function (next) {
		Product.model.findOne()
			.where('_id', locals.filters.product).populate({ path: 'application', populate: { path: 'framework' } })
			.populate({ path: 'productType', populate: { path: 'attributeGroups', populate: { path: 'attributes' } } })
			.exec(function (err, pt) {
				if (err) return res.err(err);
				if (!pt) return res.notfound('Product not found');
				if (req.user._id.toString() !== pt.application.createdBy.toString()) return res.redirect('/');
				locals.product = pt;
				next();
			});
	});

	view.on('init', function (next) {
		AttributeValue.model.find()
			.where('product', locals.product)
			.exec(function (err, attValues) {
				if (err) return res.err(err);

				locals.attributeValues = attValues;

				locals.incompleteAttributes = [];
				// hack
				if (locals.product.productType.isListable) {
					if (locals.product.name === '') locals.incompleteAttributes.push('name');
					if (locals.product.shortDescription === '') locals.incompleteAttributes.push('shortDescription');
				}

				var groups = locals.product.productType.attributeGroups;
				for (var i = 0; i < groups.length; i++) {
					for (var c = 0; c < groups[i].attributes.length; c++) {
						var v = locals.attributeValues.find(o => o.attribute.toString() === groups[i].attributes[c].id.toString()); // or use == but that's risky
						if (!v) locals.incompleteAttributes.push(v);
						else if (groups[i].attributes[c].required && v === '') locals.incompleteAttributes.push(v);
					}
				}
				next();
			});
	});

	view.on('post', { action: 'complete' }, function (next) {

		locals.product.status = 'complete';
		locals.product.save(function (err) {
			if (err) return res.err(err.errors);
			return res.redirect('/application/services/' + locals.product.application.id);
		});
		// var newApp = new Application.model({
		// 	createdBy: locals.user.id,
		// 	framework: locals.framework,
		// });
		// newApp.save(function (err) {
		// 	if (err) return res.err(err.errors);
		// 	return res.redirect('/application/summary/' + newApp.id);
		// });

	});

	// Render the view
	view.render('application/services/updateService');
};
