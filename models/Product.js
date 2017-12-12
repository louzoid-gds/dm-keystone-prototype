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
	track: true,
});

Product.add({
	name: { type: Types.Text, required: false },
	shortDescription: { type: Types.Textarea },
	description: { type: Types.Markdown, required: false },
	price: { type: Types.Money, required: false },
	status: { type: Types.Select, required: true, default: 'draft', options: [
		{ value: 'draft', label: 'Draft' },
		{ value: 'complete', label: 'Complete' },
		{ value: 'live', label: 'Live' },
		{ value: 'archived', label: 'Archived' },
	] },
	productType: { type: Types.Relationship, ref: 'ProductType' },
	application: { type: Types.Relationship, ref: 'Application' },  // relationship prob best this way round
	categories: { type: Types.Relationship, ref: 'Category', many: true },
});

// virtuals
Product.schema.virtual('islive').get(function () {
	return this.status === 'live';
});

Product.defaultSort = '-name';
Product.defaultColumns = 'name, status, productType, createdAt';

Product.relationship({ path: 'attributes', ref: 'AttributeValue', refPath: 'product' });
Product.register();
