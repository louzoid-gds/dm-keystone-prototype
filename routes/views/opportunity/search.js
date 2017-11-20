var keystone = require('keystone');
var Opportunity = keystone.list('Opportunity');
// var Category = keystone.list('Category');
exports = module.exports = function (req, res) {

	var view = new keystone.View(req, res);
	var locals = res.locals;
	locals.filters = {
		cat: req.params.category,
	};

	view.on('init', function (next) {
		// can't query by virtual params which is fair enough
		var q = Opportunity.model.find({ publishedAt: { $lt: Date.now() }, closesAt: { $gte: Date.now() } }); // .where('publishedAt', true);
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
