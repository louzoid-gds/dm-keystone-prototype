var keystone = require('keystone');
var Types = keystone.Field.Types;

/**
 * Assessment Method Model
 * Evaluation criteria have assessment methods
 * =============
 */

var AssessmentMethod = new keystone.List('AssessmentMethod', {
	nocreate: false,
	noedit: false,
	track: true,
});

AssessmentMethod.add({
	name: { type: Types.Text, required: true },
	description: { type: Types.Textarea },
});

AssessmentMethod.defaultSort = '-name';
AssessmentMethod.defaultColumns = 'name, createdAt';

AssessmentMethod.register();
