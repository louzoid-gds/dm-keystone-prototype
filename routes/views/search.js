var keystone = require('keystone');
var Product = keystone.list('Product');
var Category = keystone.list('Category');

exports = module.exports = function (req, res) {

	var view = new keystone.View(req, res);
	var locals = res.locals;
	locals.filters = {
		cat: req.params.category,
	};

	view.on('init', function (next) {
		Category.model.findOne()
			.where('_id', locals.filters.cat)
			.populate('parentCategory')
			.exec(function (err, cat) {
				if (err) return res.err(err);
				if (!cat) return res.notfound('Category not found');

				locals.category = cat;
				next();
			});
	});

	view.on('init', function (next) {
		var q = Product.model.find().where('status', 'live'); // again, service layer needed rather than logic here.  Stinky
		q.where('categories').in([locals.category]);
		q.exec(function (err, products) {
			if (err) return res.err(err);
			locals.products = products;
			next();
		});
	});

	// locals.section is used to set the currently selected
	// item in the header navigation.
	locals.section = 'home';

	// Render the view
	view.render('search');
};
