var keystone = require('keystone');
var Types = keystone.Field.Types;

/**
 * Product Model
 * Or more often than not, a service
 * =============
 */

var Product = new keystone.List('Product', {
	nocreate: false,
	noedit: false,
});

Product.add({
	name: { type: Types.Text, required: true },
	shortDescription: { type: Types.Textarea },
	description: { type: Types.Markdown, required: false },
	price: { type: Types.Money, required: false },
	isLive: { type: Types.Boolean, default: false },
	productType: { type: Types.Relationship, ref: 'ProductType' },
	categories: { type: Types.Relationship, ref: 'Category', many: true },
	createdAt: { type: Date, default: Date.now, noedit: true }
});

Product.defaultSort = '-name';
Product.defaultColumns = 'name, isLive, createdAt';

Product.relationship({ path: 'attributes', ref: 'ProductProductTypeAttributeValue', refPath: 'product' });
Product.register();