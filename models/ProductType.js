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
	attributes: { type: Types.Relationship, ref: 'ProductTypeAttribute', many: true }
});

ProductType.defaultSort = '-name';
ProductType.defaultColumns = 'name, isListable, isOpenToCompetition, createdAt';
ProductType.register();
