var keystone = require('keystone');
var Opportunity = keystone.list('Opportunity');
// var Category = keystone.list('Category');
exports = module.exports = function (req, res) {

	var view = new keystone.View(req, res);
	var locals = res.locals;
	locals.filters = {
		cat: req.params.category
	};

	// view.on('init', function (next) {
	// 	Category.model.findOne()
	// 		.where('_id', locals.filters.cat)
	// 		.populate('parentCategory')
	// 		.exec(function (err, cat) {
	// 			if (err) return res.err(err);
	// 			if (!cat) return res.notfound('Category not found');

	// 			locals.category = cat;
	// 			next();
	// 		});
	// });

	view.on('init', function (next) {
		var q = Opportunity.model.find(); // .where('isPublished', true);
		if (locals.category) {
			q.where('categories').in([locals.category]);
		}
		q.exec(function (err, opps) {
			if (err) return res.err(err);
			locals.opportunities = opps;
			next();
		});
	});

	// Render the view
	view.render('opportunity/search');
};
