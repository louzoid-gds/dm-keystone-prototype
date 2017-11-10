var keystone = require('keystone');
var Types = keystone.Field.Types;

/**
 * Evaluation Criteria Value Model
 * Criteria items have values per opportunity
 * =============
 */

var EvaluationCriteriaValue = new keystone.List('EvaluationCriteriaValue', {
	nocreate: false,
	noedit: false,
	track: true,
	map: { name: 'weighting' },
});

EvaluationCriteriaValue.add({
	weighting: { type: Types.Number, initial: true },
	criteriaLines: { type: Types.TextArray },
	evaluationCriteria: { type: Types.Relationship, ref: 'EvaluationCriteria', initial: true },
	opportunity: { type: Types.Relationship, ref: 'Opportunity', initial: true },
});

// gaa! can't get it to show link to actual thing.  Oh well.
EvaluationCriteriaValue.defaultColumns = 'name, evaluationCriteria, weighting, opportunity, createdAt';
EvaluationCriteriaValue.register();
