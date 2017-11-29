var keystone = require('keystone');
var Types = keystone.Field.Types;

/**
 * Application Model
 * Apply to be included on a framework i.e. be able to sell stuff!
 * =============
 */

var Application = new keystone.List('Application', {
	nocreate: false,
	noedit: false,
	track: true,
});

Application.add({
	framework: { type: Types.Relationship, ref: 'Framework', required: true, initial: true },
	declarationCoreTerms: { type: Types.Relationship, ref: 'DeclarationCoreTerms' },
	// (group the below under declaration object?)
	// core terms (application specific copy of core term values)
	// framework specific terms (Call off terms? Schedule terms? What's the proper name for these?),
	// these statuses are probably wrong. Revisit.
	status: { type: Types.Select, required: true, default: 'inProgress', options: [
		{ value: 'inProgress', label: 'In Progress' },
		{ value: 'complete', label: 'Complete' },
		{ value: 'inReview', label: 'In Review' },
		{ value: 'closed', label: 'Closed' },
	] },
	outcome: { type: Types.Select, options: [
		{ value: 'accepted', label: 'Accepted onto framework' },
		{ value: 'failed', label: 'Application rejected' },
	] },
});

// virtuals
// just trying to avoid magic strings in views.  Chances are won't just be a string status anyway
// basically, i need to understand the lifecycle of an application a bit better
Application.schema.virtual('isPotentiallyEditable').get(function () {
	return this.status === 'inProgress' || this.status === 'complete';
});

Application.defaultSort = '-createdAt';
Application.defaultColumns = 'framework, createdAt';

Application.register();
