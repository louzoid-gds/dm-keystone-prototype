var keystone = require('keystone');
var Opportunity = keystone.list('Opportunity');
var ProductType = keystone.list('ProductType');
exports = module.exports = function (req, res) {

	// todo - make the better!!!
	// prob also need an intro page like present flow
	if (!req.user) {
		return res.redirect('/account/signin?target=' + '/opportunity/create/step1/' + req.params.opportunityType); // +this.route - how do we do that in express?
	}

	var view = new keystone.View(req, res);
	var locals = res.locals;
	locals.filters = {
		pt: req.params.opportunityType
	};

	view.on('init', function (next) {
		ProductType.model.findOne()
			.where('_id', locals.filters.pt).populate('opportunityConfiguration')
			.exec(function (err, pt) {
				if (err) return res.err(err);
				if (!pt) return res.notfound('Product type not found');

				locals.productType = pt;
				next();
			});
	});

	view.on('post', { action: 'create-opp' }, function (next) {

		var newOpp = new Opportunity.model({
			createdBy: locals.user.id,
			productType: locals.productType.id,
			// important: copy current state of opp config into this obejct so we use going forward.  This means all responses will reference same config
			configurationAtCreation: locals.productType.opportunityConfiguration.id,
		});
		var updater = newOpp.getUpdateHandler(req);

		updater.process(req.body, {
			flashErrors: true,
			// fields: 'title, description',
			fields: 'title',
			errorMessage: 'There was a problem creating your opportunity',
		}, function (err) {
			if (err) {
				locals.validationErrors = err.errors;
			} else {
				// redirect to step 2/overview screen
				return res.redirect('/opportunity/update/summary/' + newOpp.id);
			}
			next();
		});

	});

	// Render the view
	view.render('opportunity/step1');
};
