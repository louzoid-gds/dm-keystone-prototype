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
	app.get('/opportunity/search', routes.views.opportunity.search);
	app.get('/opportunity/create', routes.views.opportunity.create);
	app.all('/opportunity/create/step1/:opportunityType', routes.views.opportunity.step1);
	app.all('/opportunity/update/summary/:opportunity', routes.views.opportunity.summary);
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

	// NOTE: To protect a route so that only admins can see it, use the requireUser middleware:
	// app.get('/protected', middleware.requireUser, routes.views.protected);

};
