var keystone = require('keystone');
var Types = keystone.Field.Types;

/**
 * Attribute Model
 * Field type !
 * =============
 */

var Attribute = new keystone.List('Attribute', {
	nocreate: false,
	noedit: false,
	track: true,
	map: { name: 'label' },
});

Attribute.add({
	label: { type: Types.Text, required: true, initial: true },
	questionType: { type: Types.Select, required: true, initial: true, options: [
		{ value: 'text', label: 'Textbox' },
		{ value: 'boolean', label: 'True/False' },
		{ value: 'textArea', label: 'Textarea' },
	] },
	usage: { type: Types.Select, required: true, initial: true, options: [
		{ value: 'productField', label: 'Product field' },
		{ value: 'opportunityField', label: 'Opportunity field' },
		{ value: 'evaluationField', label: 'Evaluation field' },
	] },
	description: { type: Types.Text, initial: false },
	placeholder: { type: Types.Text, initial: false },
	note: { type: Types.Text, initial: false },
	required: { type: Types.Boolean, default: false }, // lots more validation stuff needed
});

Attribute.defaultSort = '-name';
Attribute.defaultColumns = 'label, questionType, usage, createdAt';
Attribute.register();
