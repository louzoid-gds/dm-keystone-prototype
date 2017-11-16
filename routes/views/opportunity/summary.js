var keystone = require('keystone');
var Opportunity = keystone.list('Opportunity');
var AttributeValue = keystone.list('AttributeValue');
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
			.where('_id', locals.filters.opportunity).populate({ path: 'configurationAtCreation', populate: { path: 'detailedRequirements' } })
			.exec(function (err, opp) {
				if (err) return res.err(err);
				if (!opp) return res.notfound('Opportunity not found');

				locals.opportunity = opp;
				next();
			});
	});

	// Next: work out what still needs doing.
	// this functionality should be in the model or a service layer.  Not here.
	view.on('init', function (next) {
		AttributeValue.model.find()
			.where('opportunity', locals.filters.opportunity)
			.exec(function (err, oppValues) {
				if (err) return res.err(err);
				locals.opportunityAttributeValues = oppValues;

				locals.incompleteAttributes = [];
				var req = locals.opportunity.configurationAtCreation.detailedRequirements;
				if (!req) next();
				for (var i = 0; i < req.length; i++) {
					var v = locals.opportunityAttributeValues.find(o => o.attribute.toString() === req[i].id.toString()); // or use == but that's risky
					if (!v) locals.incompleteAttributes.push(v);
					if (req[i].required && v === '') locals.incompleteAttributes.push(v);
				}
				next();
			});
	});
	// view.on('init', function (next) {
		
	// });

	// Render the view
	view.render('opportunity/summary');
};
