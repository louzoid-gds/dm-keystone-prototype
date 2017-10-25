var keystone = require('keystone');
var Types = keystone.Field.Types;

/**
 * Category Model
 * Enable sorting of products by category.  Not by FW. Not by product type
 * =============
 */

var Category = new keystone.List('Category', {
	nocreate: false,
	noedit: false,
});

Category.add({
	name: { type: Types.Text, required: true },
	description: { type: Types.Markdown, required: false },
	isHidden: { type: Types.Boolean, default: false },
	//needs an ordering attribute too
	parentCategory: { type: Types.Relationship, ref: 'Category' },
	createdAt: { type: Date, default: Date.now, noedit: true }
});

Category.defaultSort = '-name';
Category.defaultColumns = 'name, isHidden, parentCategory, createdAt';

Category.relationship({ path: 'subCategories', ref: 'Category', refPath: 'parentCategory' });
Category.register();
