var keystone = require('keystone');
// var Opportunity = keystone.list('Opportunity');
var ProductType = keystone.list('ProductType');
exports = module.exports = function (req, res) {

	var view = new keystone.View(req, res);
	var locals = res.locals;

	view.on('init', function (next) {
		var q = ProductType.model.find().where('isOpenToCompetition', true);
		q.exec(function (err, pts) {
			if (err) return res.err(err);
			locals.productTypesToList = pts;
			next();
		});
	});

	// Render the view
	view.render('opportunity/create');
};
