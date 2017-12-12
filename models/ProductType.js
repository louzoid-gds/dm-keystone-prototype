var keystone = require('keystone');
var Types = keystone.Field.Types;

/**
 * Product type Model
 * Basically a service type which in turn corresponds to a 'lot'
 * =============
 */

var ProductType = new keystone.List('ProductType', {
	nocreate: false,
	noedit: false,
	track: true,
});

ProductType.add({
	name: { type: Types.Text, required: true },
	description: { type: Types.Markdown },
	isListable: { type: Types.Boolean, initial: true },
	isOpenToCompetition: { type: Types.Boolean, initial: true },
	canAddMoreThanOneServiceOnApplication: { type: Types.Boolean, default: true },
	attributeGroups: { type: Types.Relationship, ref: 'AttributeGroup', many: 'true', note: 'Properties for the service listing and search' },
	// seeing as we're using Mongo, probably better off as a nested obj!  Found out a bit late that Keystone supports these.  Oh well!
	opportunityConfiguration: { type: Types.Relationship, ref: 'OpportunityConfiguration', dependsOn: { isOpenToCompetition: true } },
});

ProductType.defaultSort = '-name';
ProductType.defaultColumns = 'name, isListable, isOpenToCompetition, createdAt';
ProductType.register();
