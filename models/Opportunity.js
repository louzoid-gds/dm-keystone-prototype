var keystone = require('keystone');
var Types = keystone.Field.Types;

/**
 * Opportunity Model
 * Request help with what you need!
 * =============
 */

var Opportunity = new keystone.List('Opportunity', {
	nocreate: false,
	noedit: false,
	map: { name: 'title' },
	track: true,
});

Opportunity.add(
	{
		title: { type: Types.Text, required: true },
		summaryOfWork: { type: Types.Textarea, required: false },
		budgetRange: { type: Types.Textarea },
		additionalTerms: { type: Types.Textarea },
		questionsAndAnswers: { type: Types.Textarea },
		publishedAt: { type: Types.Date },
		productType: { type: Types.Relationship, ref: 'ProductType', filters: { isOpenToCompetition: true } },
		configurationAtCreation: { type: Types.Relationship, ref: 'OpportunityConfiguration' },
	},
	{ heading: 'Evaluation criteria' },
	{
		noOfSuppliersToEvaluate: { type: Types.Number },
		assessmentMethods: { type: Types.Relationship, ref: 'AssessmentMethod', many: true },
	}
);

Opportunity.defaultSort = '-createdAt';
Opportunity.defaultColumns = 'title, productType, configurationAtCreation, createdAt';

// reference responses here
Opportunity.relationship({ path: 'attributes', ref: 'AttributeValue', refPath: 'opportunity' });
Opportunity.relationship({ path: 'evaluationCriteria', ref: 'EvaluationCriteriaValue', refPath: 'opportunity' });
Opportunity.register();
