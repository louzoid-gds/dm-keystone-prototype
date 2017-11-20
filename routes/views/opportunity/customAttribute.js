var keystone = require('keystone');
var Opportunity = keystone.list('Opportunity');
var Attribute = keystone.list('Attribute');
var AttributeValue = keystone.list('AttributeValue');

exports = module.exports = function (req, res) {

	if (!req.user) {
		return res.redirect('/');
	}

	var view = new keystone.View(req, res);
	var locals = res.locals;
	locals.filters = {
		opportunity: req.params.opportunity,
		attribute: req.params.attribute
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

	view.on('init', function (next) {
		Attribute.model.findOne()
			.where('_id', locals.filters.attribute)
			.exec(function (err, att) {
				if (err) return res.err(err);

				locals.attribute = att;
				next();
			});
	});

	view.on('init', function (next) {
		AttributeValue.model.findOne()
			.where('attribute', locals.attribute)
			.where('opportunity', locals.opportunity)
			.exec(function (err, attValue) {
				if (err) return res.err(err);

				locals.attributeValue = attValue;
				next();
			});
	});

	view.on('post', { action: 'update' }, function (next) {
		var updater;
		if (locals.attributeValue) {
			updater = locals.attributeValue.getUpdateHandler(req);
		} else {
			var newValue = new AttributeValue.model();
			newValue.opportunity = locals.opportunity;
			newValue.attribute = locals.attribute;
			updater = newValue.getUpdateHandler(req);
		}

		updater.process(req.body, {
			flashErrors: true,
			fields: 'value', // need custom error handling, this isn't going to cut it
			errorMessage: 'Something went wrong updating this field',
		}, function (err) {
			if (err) {
				locals.validationErrors = err.errors;
			} else {
				return res.redirect('/opportunity/update/' + locals.opportunity.id + '/detailedRequirements');
			}
			next();
		});

	});
	// Render the view
	view.render('opportunity/fields/customAttribute');
};
