var keystone = require('keystone');
var Types = keystone.Field.Types;

/**
 * DeclarationCoreTerms Model
 * The core terms remain consistant regardless of framework.  If we add a new field, it gets added everywhere
 * =============
 */

var DeclarationCoreTerms = new keystone.List('DeclarationCoreTerms', {
	nocreate: false,
	noedit: false,
	track: true,
});

DeclarationCoreTerms.add({
	application: { type: Types.Relationship, ref: 'Application' } },
	{ heading: 'Essentials' },
	{ essentials: {
		complyWithTerms: { type: Types.Boolean },
		acceptTermsAndConditions: { type: Types.Boolean },
		agreeToSign: { type: Types.Boolean },
	} },
	{ heading: 'Grounds for mandatory exclusion' },
	{ groundsForMandatoryExclusion: {
		convictedOfConspiracy: { type: Types.Boolean },
	} }
);

DeclarationCoreTerms.defaultSort = '-createdAt';
DeclarationCoreTerms.defaultColumns = 'application, createdAt';

DeclarationCoreTerms.register();
