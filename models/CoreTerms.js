var keystone = require('keystone');
var Types = keystone.Field.Types;

/**
 * CoreTerms Model
 * The core terms remain consistant regardless of framework.  If we add a new field, it gets added everywhere
 * =============
 */

var CoreTerms = new keystone.List('CoreTerms', {
	nocreate: false,
	noedit: false,
	track: true,
});

CoreTerms.add({
	name: { type: Types.Text, required: true, initial: true },
	versionNo: { type: Types.Number, required: true, initial: true },
	reasonForChange: { type: Types.Textarea, required: true, initial: true },
	essentials: { type: Types.Relationship, ref: 'Attribute', many: true, filters: { usage: 'coreTermsField' } },
	groundsForMandatoryExclusion: { type: Types.Relationship, ref: 'Attribute', many: true, filters: { usage: 'coreTermsField' } },
	groundsForDiscretionaryExclusion: { type: Types.Relationship, ref: 'Attribute', many: true, filters: { usage: 'coreTermsField' } },
	workingWithGovernment: { type: Types.Relationship, ref: 'Attribute', many: true, filters: { usage: 'coreTermsField' } },
	workingWithDigital: { type: Types.Relationship, ref: 'Attribute', many: true, filters: { usage: 'coreTermsField' } },
	aboutYou: { type: Types.Relationship, ref: 'Attribute', many: true, filters: { usage: 'coreTermsField' } },
});

CoreTerms.defaultSort = '-versionNo';
CoreTerms.defaultColumns = 'name, versionNo, createdAt';

CoreTerms.register();
