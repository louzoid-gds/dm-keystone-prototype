var keystone = require('keystone');
var Opportunity = keystone.list('Opportunity');
exports = module.exports = function (req, res) {

	if (!req.user) {
		return res.redirect('/');
	}

	var view = new keystone.View(req, res);
	var locals = res.locals;
	locals.filters = {
		opportunity: req.params.opportunity,
	};

	view.on('init', function (next) {
		Opportunity.model.findOne()
			.where('_id', locals.filters.opportunity)
			.exec(function (err, opp) {
				if (err) return res.err(err);
				if (!opp) return res.notfound('Opportunity not found');

				locals.opportunity = opp;
				if (req.user._id.toString() !== opp.createdBy.toString()) return res.redirect('/');
				next();
			});
	});

	view.on('post', { action: 'publish' }, function (next) {

		locals.opportunity.publish(function (err) {
			if (err) {
				locals.validationErrors = err; // should be checked first but hohum
			}
			else {
				return res.redirect('/opportunity/update/summary/' + locals.opportunity.id);
			}
		});

	});
	// Render the view
	view.render('opportunity/publish');
};
