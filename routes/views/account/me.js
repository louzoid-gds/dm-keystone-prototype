var keystone = require('keystone');

exports = module.exports = function (req, res) {

	if (!req.user) {
		return res.redirect('/');
	}

	var view = new keystone.View(req, res);
	// var locals = res.locals;

	view.render('account/me');

};
