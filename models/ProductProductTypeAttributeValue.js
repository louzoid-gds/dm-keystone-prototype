var keystone = require('keystone');
var Types = keystone.Field.Types;

/**
 * Product type attribute value Model
 * Product types have attributes, those attributes have values
 * =============
 */

var ProductProductTypeAttributeValue = new keystone.List('ProductProductTypeAttributeValue', {
	nocreate: false,
	noedit: false,
	map: { name: 'value' }
});

ProductProductTypeAttributeValue.add({
	value: { type: Types.Text, required: true, initial: true },
	product: { type: Types.Relationship, ref: 'Product', initial: true, required: true },
	productTypeAttribute: { type: Types.Relationship, ref: 'ProductTypeAttribute', initial: true, required: true },
	createdAt: { type: Date, default: Date.now, noedit: true }
});

//ProductTypeAttributeValue.defaultSort = '-name';
ProductProductTypeAttributeValue.defaultColumns = 'productTypeAttribute, value, product, createdAt';
ProductProductTypeAttributeValue.register();
