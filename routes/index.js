/**
 * This file is where you define your application routes and controllers.
 *
 * Start by including the middleware you want to run for every request;
 * you can attach middleware to the pre('routes') and pre('render') events.
 *
 * For simplicity, the default setup for route controllers is for each to be
 * in its own file, and we import all the files in the /routes/views directory.
 *
 * Each of these files is a route controller, and is responsible for all the
 * processing that needs to happen for the route (e.g. loading data, handling
 * form submissions, rendering the view template, etc).
 *
 * Bind each route pattern your application should respond to in the function
 * that is exported from this module, following the examples below.
 *
 * See the Express application routing documentation for more information:
 * http://expressjs.com/api.html#app.VERB
 */

var keystone = require('keystone');
var middleware = require('./middleware');
var importRoutes = keystone.importer(__dirname);

// Common Middleware
keystone.pre('routes', middleware.initErrorHandlers);
keystone.pre('routes', middleware.initLocals);
keystone.pre('render', middleware.flashMessages);

// Import Route Controllers
var routes = {
	views: importRoutes('./views'),
};

// Setup Route Bindings
exports = module.exports = function (app) {
	// Views
	app.get('/', routes.views.index);
	app.get('/catalogue', routes.views.catalogue);
	app.get('/catalogue/:category?', routes.views.catalogue);
	app.get('/catalogue/search/:category', routes.views.search);
	app.get('/catalogue/service/:product', routes.views.product);

	app.get('/opportunity/search', routes.views.opportunity.search);
	app.get('/opportunity/create', routes.views.opportunity.create);
	app.all('/opportunity/create/step1/:opportunityType', routes.views.opportunity.step1);
	app.all('/opportunity/update/summary/:opportunity', routes.views.opportunity.summary);
	app.all('/opportunity/update/publish/:opportunity', routes.views.opportunity.publish);
	app.get('/opportunity/update/evaluationSummary/:opportunity', routes.views.opportunity.evaluationSummary);
	app.get('/opportunity/update/:opportunity/detailedRequirements', routes.views.opportunity.detailedRequirements);
	app.all('/opportunity/update/:opportunity/detailedRequirements/:attribute', routes.views.opportunity.customAttribute);
	app.all('/opportunity/update/:opportunity/evaluationCriteria/:evaluationCriteria', routes.views.opportunity.evaluationCriteria);
	app.all('/opportunity/update/:opportunity/assessmentMethods', routes.views.opportunity.assessmentMethods);
	app.all('/opportunity/update/:opportunity/evaluationWeighting', routes.views.opportunity.evaluationWeighting);
	app.all('/opportunity/update/:opportunity/:field', routes.views.opportunity.basics);

	app.all('/contact', routes.views.contact);

	app.all('/account/signin', routes.views.account.signin);
	app.all('/account/me', routes.views.account.me);
	app.all('/account/signout', routes.views.account.signout);
	app.all('/account/opportunities', routes.views.account.opportunities);
	app.all('/account/applications', routes.views.account.applications);

	app.post('/application/create/:framework', routes.views.application.create);
	app.get('/application/summary/:application', routes.views.application.summary);
	app.all('/application/declaration/start/:application', routes.views.application.declaration.start);
	app.get('/application/declaration/update/:application', routes.views.application.declaration.summary);
	app.all('/application/declaration/update/:application/:coreTermGroup', routes.views.application.declaration.coreTermGroup);
	app.get('/application/services/:application', routes.views.application.services.summary);
	app.all('/application/services/:application/:type', routes.views.application.services.byType);
	app.all('/application/services/:application/:type/create', routes.views.application.services.create);
	app.all('/application/services/:application/service/:product', routes.views.application.services.updateService);
	app.all('/application/services/:application/service/:product/basics/:field', routes.views.application.services.basics);
	app.all('/application/services/:application/service/:product/:attribute', routes.views.application.services.customAttribute);
	// NOTE: To protect a route so that only admins can see it, use the requireUser middleware:
	// app.get('/protected', middleware.requireUser, routes.views.protected);

};
