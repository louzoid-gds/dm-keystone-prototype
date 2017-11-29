var keystone = require('keystone');
var Application = keystone.list('Application');
var Framework = keystone.list('Framework');
exports = module.exports = function (req, res) {

	if (!req.user) {
		return res.redirect('/');
	}

	var view = new keystone.View(req, res);
	var locals = res.locals;

	view.on('init', function (next) {
		var q = Application.model.find().populate('framework').where('createdBy', req.user);

		q.exec(function (err, apps) {
			if (err) return res.err(err);
			locals.applications = apps;
			next();
		});
	});

	view.on('init', function (next) {
		var q = Framework.model.find(); // not bothering filtering for prototype

		q.exec(function (err, fws) {
			if (err) return res.err(err);
			locals.frameworks = fws;
			next();
		});
	});


	view.render('account/applications');

};
