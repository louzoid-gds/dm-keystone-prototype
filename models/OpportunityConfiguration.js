var keystone = require('keystone');
var Types = keystone.Field.Types;

/**
 * OpportunityConfiguration Model
 * How a product type opportunity model is configured
 * =============
 */

var OpportunityConfiguration = new keystone.List('OpportunityConfiguration', {
	nocreate: false,
	noedit: false,
	track: true,
});

OpportunityConfiguration.add(
	{
		name: { type: Types.Text, required: true, initial: true },
		detailedRequirements: { type: Types.Relationship, ref: 'Attribute', filters: { usage: 'opportunityField' }, many: true },
		howLongOpenForOptions: { type: Types.NumberArray, note: 'Enter options in days for how long the opp should be open for.  E.g. Enter 7 for 1 week.  If no options are specified, the default is 14 (2 weeks)' }
	},
	// header object
	{ heading: 'Evaluation criteria' },
	{
		evaluationCriteria: { type: Types.Relationship, ref: 'EvaluationCriteria', filters: { parentEvaluationCriteria: '' }, many: true },
		weightingParams: { type: Types.TextArray, note: 'Enter a weighting range for each evaluation criterium seperated by a hyphen e.g. 10-70 for 10% to 70% (not ideal but fine for now)' },
		assessmentMethodsAvailable: { type: Types.Relationship, ref: 'AssessmentMethod', many: true },
	}
);

OpportunityConfiguration.defaultSort = '-name';
OpportunityConfiguration.defaultColumns = 'name, isListable, isOpenToCompetition, createdAt';
OpportunityConfiguration.register();
