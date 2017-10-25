var keystone = require('keystone');
var Types = keystone.Field.Types;

/**
 * ProductTypeOpportunityAttribute Model
 * Field type for opportunities !
 * =============
 */

var ProductTypeOpportunityAttribute = new keystone.List('ProductTypeOpportunityAttribute', {
	nocreate: false,
	noedit: false,
	map: { name: 'label' }
});

ProductTypeOpportunityAttribute.add({
	label: { type: Types.Text, required: true, initial: true },
	questionType: { type: Types.Select, required: true, initial: true, options: [
		{ value: 'text', label: 'Textbox' },
		{ value: 'boolean', label: 'True/False' },
		{ value: 'textArea', label: 'Textarea' },
	] },
	legend: { type: Types.Text, initial: false },
	hint: { type: Types.Text, initial: false },
	createdAt: { type: Date, default: Date.now, noedit: true },
});

ProductTypeOpportunityAttribute.defaultSort = '-name';
ProductTypeOpportunityAttribute.defaultColumns = 'label, questionType, createdAt';
ProductTypeOpportunityAttribute.register();
