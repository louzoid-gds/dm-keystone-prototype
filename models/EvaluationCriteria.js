var keystone = require('keystone');
var Types = keystone.Field.Types;

/**
 * Evaluation Criteria Model
 * Opportunity config items have evaluation criteria items
 * =============
 */

var EvaluationCriteria = new keystone.List('EvaluationCriteria', {
	nocreate: false,
	noedit: false,
	track: true,
});

EvaluationCriteria.add({
	name: { type: Types.Text, required: true },
	description: { type: Types.Markdown },
	descriptionForWeighting: { type: Types.Markdown },
	canAddCriteriaLines: { type: Types.Boolean, default: false },
	minCriteriaLines: { type: Types.Number, dependsOn: { canAddCriteriaLines: true } },
	maxCriteriaLines: { type: Types.Number, dependsOn: { canAddCriteriaLines: true } },
	// parentEvaluationCriteria: { type: Types.Relationship, ref: 'EvaluationCriteria' },
	childCriteria: { type: Types.Relationship, ref: 'EvaluationCriteria', many: true },
});

EvaluationCriteria.defaultSort = '-name';
EvaluationCriteria.defaultColumns = 'name, canAddCriteriaLines, parentEvaluationCriteria, createdAt';
// EvaluationCriteria.relationship({ path: 'subCriteria', ref: 'EvaluationCriteria', refPath: 'parentEvaluationCriteria' });
EvaluationCriteria.register();
