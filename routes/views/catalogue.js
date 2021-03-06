var keystone = require('keystone');
// var Product = keystone.list('Product');
var Category = keystone.list('Category');

exports = module.exports = function (req, res) {

	var view = new keystone.View(req, res);
	var locals = res.locals;
	locals.filters = {
		cat: req.params.category,
	};

	// must be a better way of doing this than doing 2 queries....
	view.on('init', function (next) {
		if (locals.filters.cat) {
			Category.model.findOne()
				.where('_id', locals.filters.cat)
				.exec(function (err, cat) {
					if (err) return res.err(err);
					if (!cat) return res.notfound('Category not found');

					locals.category = cat;
					next();
				});
		}
		else {
			next();
		}
	});

	view.on('init', function (next) {

		if (locals.category) {
			Category.model.find()
				.where('isHidden', 'false')
				.where('parentCategory', locals.filters.cat)
				.exec(function (err, cats) {
					locals.categories = cats;
					next();
				});
		}
		else {
			Category.model.find()
				.where('isHidden', 'false')
				.exists('parentCategory', false)
				.exec(function (err, cats) {
					locals.categories = cats;
					next();
				});
		}
	});

	view.on('init', function (next) {
		if (!locals.categories) {
			next();
		}
		else {
			// for each category, check for sub cats
			var childCats = [];
			locals.childCategories = {};
			locals.categories.forEach(function (item) {
				// this is dangerous and not cool for production
				var getPromise = Category.model.find()
					.where('parentCategory', item.id)
					.exec(function (err, cc) {
						if (!err) {
							locals.childCategories[item.id] = cc;
						}
					});
				childCats.push(getPromise);
			});
			Promise.all(childCats).then(function (results) {
				next();
			}).catch(function (err) {
				return res.err(err);
			});
		}
	});

	// locals.section is used to set the currently selected
	// item in the header navigation.
	locals.section = 'home';

	// Render the view
	view.render('catalogue');
};
