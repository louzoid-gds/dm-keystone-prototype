var keystone = require('keystone');
var Types = keystone.Field.Types;

/**
 * Attribute value Model
 * Attributes have values
 * =============
 */

var AttributeValue = new keystone.List('AttributeValue', {
	nocreate: false,
	noedit: false,
	map: { name: 'value' },
	track: true,
});

AttributeValue.add({
	value: { type: Types.Text, initial: true },
	product: { type: Types.Relationship, ref: 'Product', initial: true },
	opportunity: { type: Types.Relationship, ref: 'Opportunity', initial: true },
	attribute: { type: Types.Relationship, ref: 'Attribute', initial: true, required: true },
});

AttributeValue.defaultColumns = 'attribute, value, product, opportunity, createdAt';
AttributeValue.register();
