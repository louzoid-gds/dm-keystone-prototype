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
});

ProductType.add({
	name: { type: Types.Text, required: true },
	description: { type: Types.Markdown },
	isListable: { type: Types.Boolean, initial: true },
	isOpenToCompetition: { type: Types.Boolean, initial: true },
	createdAt: { type: Date, default: Date.now, noedit: true },
	attributes: { type: Types.Relationship, ref: 'Attribute', many: true, filters: { usage: 'productField' }, note: 'Properties for the service listing and search' },
	// seeing as we're using Mongo, probably better off as a nested obj!  Oh well.
	opportunityConfiguration: { type: Types.Relationship, ref: 'OpportunityConfiguration', dependsOn: { isOpenToCompetition: true } },
});

ProductType.defaultSort = '-name';
ProductType.defaultColumns = 'name, isListable, isOpenToCompetition, createdAt';
ProductType.register();
