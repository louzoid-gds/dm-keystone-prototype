var keystone = require('keystone');
var Opportunity = keystone.list('Opportunity');
exports = module.exports = function (req, res) {

	if (!req.user) {
		return res.redirect('/');
	}

	var view = new keystone.View(req, res);
	var locals = res.locals;

	view.on('init', function (next) {
		var q = Opportunity.model.find().where('createdBy', req.user);

		q.exec(function (err, opps) {
			if (err) return res.err(err);
			locals.opportunities = opps;
			next();
		});
	});


	view.render('account/opportunities');

};
