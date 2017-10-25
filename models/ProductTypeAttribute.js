var keystone = require('keystone');
var Types = keystone.Field.Types;

/**
 * ProductAttribute Model
 * Field type !
 * =============
 */

var ProductTypeAttribute = new keystone.List('ProductTypeAttribute', {
	nocreate: false,
	noedit: false,
	map: { name: 'label' }
});

ProductTypeAttribute.add({
	label: { type: Types.Text, required: true, initial: true },
	questionType: { type: Types.Select, required: true, initial: true, options: [
		{ value: 'text', label: 'Textbox' },
		{ value: 'boolean', label: 'True/False' },
		{ value: 'textArea', label: 'TextArea' },
	] },
	legend: { type: Types.Text, initial: false },
	hint: { type: Types.Text, initial: false },
	createdAt: { type: Date, default: Date.now, noedit: true },
});

ProductTypeAttribute.defaultSort = '-name';
ProductTypeAttribute.defaultColumns = 'label, questionType, createdAt';
ProductTypeAttribute.register();
