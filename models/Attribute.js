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
	longLabel: { type: Types.Markdown }, // for labels that need MD e.g. framework terms questions
	questionType: { type: Types.Select, required: true, initial: true, options: [
		{ value: 'text', label: 'Textbox' },
		{ value: 'boolean', label: 'True/False' },
		{ value: 'textArea', label: 'Textarea' },
		{ value: 'radioOptions', label: 'Radio options' },
	] },
	options: { type: Types.TextArray, dependsOn: { questionType: 'radioOptions' } },
	// Todo: these should probably be split out into separate types as have differing needs
	usage: { type: Types.Select, required: true, initial: true, options: [
		{ value: 'productField', label: 'Product field' },
		{ value: 'opportunityField', label: 'Opportunity field' },
		{ value: 'evaluationField', label: 'Evaluation field' },
		{ value: 'coreTermsField', label: 'Core terms field' },
		{ value: 'applicationField', label: 'Framework application field' },
	] },
	description: { type: Types.Text, initial: false },
	placeholder: { type: Types.Text, initial: false },
	note: { type: Types.Text, initial: false },
	required: { type: Types.Boolean, default: false }, // lots more validation stuff needed
	// filtering is interesting... doesn't always map directly to attributes (see g cloud 'user support' example)
	// perhaps we need to define filter groups and mappings in a separate UI flow...(see notepad)
	// canBeUsedAsFilter: { type: Types.Boolean, dependsOn: { questionType: 'boolean', usage: 'productField' } },
	// filterName: { type: Types.Text, initial: false, dependsOn: { canBeUsedAsFilter: true }, note: 'This will appear as the filter title in the catalogue' },
});

Attribute.defaultSort = '-name';
Attribute.defaultColumns = 'label, questionType, usage, createdAt';
Attribute.register();
