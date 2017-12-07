var _ = require('lodash');

var keystone = require('keystone');
var Application = keystone.list('Application');
var AttributeValue = keystone.list('AttributeValue');
exports = module.exports = function (req, res) {

	if (!req.user) {
		return res.redirect('/');
	}

	var view = new keystone.View(req, res);
	var locals = res.locals;
	locals.filters = {
		application: req.params.application,
		// todo: ensure provided coreTermGroup is valid
		coreTermGroup: req.params.coreTermGroup,
	};

	view.on('init', function (next) {
		Application.model.findOne()
			.where('_id', locals.filters.application)
			.populate({ path: 'framework', populate: { path: 'coreTermsVersionToUse',
				populate: { path: locals.filters.coreTermGroup } } })
			.exec(function (err, app) {
				if (err) return res.err(err);
				if (!app) return res.err('Application does not exist');
				if (req.user._id.toString() !== app.createdBy.toString()) return res.redirect('/');
				locals.application = app;
				next();
			});
	});

	view.on('init', function (next) {
		AttributeValue.model.find()
			.where('declaration', locals.application.declaration)
			.exec(function (err, values) {
				if (err) return res.err(err);

				locals.declarationValues = values;
				next();
			});
	});

	view.on('post', { action: 'update' }, function (next) {
		var attsToUpdate = locals.application.framework.coreTermsVersionToUse[locals.filters.coreTermGroup];
		if (!attsToUpdate) next();
		var objs = [];
		var errs = {};
		for (var i = 0; i < attsToUpdate.length; i++) {
			var val = req.body[attsToUpdate[i].id];
			if (attsToUpdate[i].required) {
				if (!val || val === '') {
					errs[attsToUpdate[i].id] = { message: attsToUpdate[i].label };
					continue;
				}
			}
			if (val) {
				objs.push({ attr: attsToUpdate[i].id, value: val });
			}
		}

		if (!_.isEmpty(errs)) {
			locals.formData = req.body || {};
			req.flash('error', {
				type: 'ValidationError',
				title: 'There was a problem with your answer to the following questions',
				list: _.map(errs, 'message'),
			});
			locals.validationErrors = errs;
			next();
			return;
		}

		var updates = [];
		objs.forEach(function (item) {
			// this is dangerous and not cool for production
			var updatePromise = AttributeValue.model.findOneAndUpdate(
				{ declaration: locals.application.declaration, attribute: item.attr },
				{ $set: { value: item.value } },
				{ safe: true, upsert: true },
			);
			updates.push(updatePromise);
		});

		Promise.all(updates).then(function (results) {
			return res.redirect('/application/declaration/update/' + locals.application.id);
		}).catch(function (err) {
			locals.validationErrors = err;
			next();
		});

	});

	// Render the view
	view.render('application/declaration/coreTerms/' + locals.filters.coreTermGroup);
};
