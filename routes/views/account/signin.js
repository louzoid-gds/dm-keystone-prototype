var keystone = require('keystone');

exports = module.exports = function (req, res) {

	if (req.user) {
		return res.redirect(req.cookies.target || '/me');
	}

	var view = new keystone.View(req, res);
	var locals = res.locals;

	locals.form = req.body;
	if (req.query.target) {
		locals.target = req.query.target; // not cool but fine for proto
	}

	view.on('post', { action: 'signin' }, function (next) {
		if (!req.body.email || !req.body.password) {
			req.flash('error', 'Please enter your username and password.');
			return next();
		}
		var onSuccess = function () {
			if (req.body.target && !/join|signin/.test(req.body.target)) {
				console.log('[signin] - Set target as [' + req.body.target + '].');
				res.redirect(req.body.target);
			} else {
				res.redirect('/account/me');
			}
		};
		var onFail = function () {
			req.flash('error', 'Your username or password were incorrect, please try again.');
			return next();
		};
		keystone.session.signin({ email: req.body.email, password: req.body.password }, req, res, onSuccess, onFail);
	});

	view.render('account/signin');

};
