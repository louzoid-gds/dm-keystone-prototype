var keystone = require('keystone');
var Application = keystone.list('Application');
var Declaration = keystone.list('Declaration');
exports = module.exports = function (req, res) {

	if (!req.user) {
		return res.redirect('/');
	}

	var view = new keystone.View(req, res);
	var locals = res.locals;
	locals.filters = {
		application: req.params.application,
	};

	view.on('init', function (next) {
		Application.model.findOne()
			.where('_id', locals.filters.application).populate('framework') // .populate('declaration')
			.exec(function (err, app) {
				if (err) return res.err(err);
				locals.application = app;
				next();
			});
	});
	view.on('post', { action: 'create' }, function (next) {

		// 1. see if user has an old one to use
		// 2. If so, copy and save
		// 2a. If not, create and save
		// 3. Update application object with reference to new thing
		// note - not doing 1 and 2 yet.  To do later

		var dec = Declaration.model({
			name: 'Declaration for application ' + locals.application.id, // yes pointless.  Makes admin look better though
		});
		dec.save(function (err) {
			if (err) return res.err(err.errors);
			locals.application.declaration = dec;
			locals.application.save(function (err) {
				if (err) return res.err(err.errors);
				return res.redirect('/application/declaration/update/' + locals.application.id);
			});
		});
	});

	// Render the view
	view.render('application/declaration/start');
};
