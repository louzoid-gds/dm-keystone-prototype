var moment = require('moment');
var keystone = require('keystone');
var Types = keystone.Field.Types;

/**
 * Framework Model
 * Yep, frameworks are still a thing
 * =============
 */

var Framework = new keystone.List('Framework', {
	nocreate: false,
	noedit: false,
});

Framework.add({
	name: { type: Types.Text, required: true },
	liveAt: { type: Types.Date, required: true, initial: true },
	expiresAt: { type: Types.Date, required: true, initial: true },
	openForApplicationsAt: { type: Types.Datetime },
	closesForApplicationsAt: { type: Types.Datetime },
	description: { type: Types.Markdown, required: false },
	productTypesToInclude: { type: Types.Relationship, ref: 'ProductType', many: true },
	coreTermsVersionToUse: { type: Types.Relationship, ref: 'CoreTerms' },
	customDeclarationTerms: { type: Types.Relationship, ref: 'Attribute', many: true, filters: { usage: 'applicationField' }, note: 'Extensions to the core terms for this framework' },
	createdAt: { type: Date, default: Date.now, noedit: true },
});

// virtuals
Framework.schema.virtual('isClosed').get(function () {
	var d = moment(this.closesForApplicationsAt);
	if (!d.isValid) return false;
	return d.isBefore(Date.now());
});
Framework.schema.virtual('isOpen').get(function () {
	var d = moment(this.openForApplicationsAt);
	if (!d.isValid) return false;
	return d.isBefore(Date.now()) && !this.isClosed;
});
Framework.schema.virtual('isComingSoon').get(function () {
	var d = moment(this.openForApplicationsAt);
	if (!d.isValid) return false;
	return moment(Date.now()).isAfter(moment(this.openForApplicationsAt).subtract(30, 'days'));
});

Framework.defaultSort = '-createdAt';
Framework.defaultColumns = 'name, createdAt';

Framework.register();
