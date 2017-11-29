var keystone = require('keystone');
var Framework = keystone.list('Framework');
var Application = keystone.list('Application');
exports = module.exports = function (req, res) {

	if (!req.user) {
		return res.redirect('/');
	}

	var view = new keystone.View(req, res);
	var locals = res.locals;
	locals.filters = {
		framework: req.params.framework,
	};

	// on init check that framework is open for apps and an app doesn't exist
	view.on('init', function (next) {
		Framework.model.findOne()
			.where('_id', locals.filters.framework)
			.exec(function (err, fw) {
				if (err) return res.err(err);
				if (!fw) return res.notfound('Framework not found');
				if (!fw.isOpen) return res.err('Framework not open for applications');
				locals.framework = fw;
				next();
			});
	});
	view.on('init', function (next) {
		Application.model.findOne()
			.where('framework', locals.framework).where('createdBy', locals.user)
			.exec(function (err, app) {
				if (err) return res.err(err);
				if (app) return res.err('User has already applied to this framework');
				next();
			});
	});
	view.on('post', { action: 'create' }, function (next) {

		var newApp = new Application.model({
			createdBy: locals.user.id,
			framework: locals.framework,
		});
		newApp.save(function (err) {
			if (err) return res.err(err.errors);
			return res.redirect('/application/summary/' + newApp.id);
		});
	});

	// Render the view
	view.render('application/create');
};
