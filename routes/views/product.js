var keystone = require('keystone');
var Product = keystone.list('Product');
var AttributeValue = keystone.list('AttributeValue');
exports = module.exports = function (req, res) {

	var view = new keystone.View(req, res);
	var locals = res.locals;
	locals.filters = {
		product: req.params.product,
	};

	view.on('init', function (next) {
		Product.model.findOne()
			.where('_id', locals.filters.product).populate({ path: 'categories', populate: { path: 'parentCategory' } })
			.populate({ path: 'productType', populate: { path: 'attributeGroups', populate: { path: 'attributes' } } })
			.exec(function (err, pt) {
				if (err) return res.err(err);
				if (!pt) return res.notfound('Product not found');
				if (pt.status !== 'live') return res.notfound('Product not published');
				locals.product = pt;
				next();
			});
	});

	view.on('init', function (next) {
		AttributeValue.model.find()
			.where('product', locals.product.id)
			.exec(function (err, attValues) {
				if (err) return res.err(err);

				locals.attributeValues = attValues;
				next();
			});
	});

	// Render the view
	// Can maybe do different templates per product type. Why not!
	view.render('product');
};
