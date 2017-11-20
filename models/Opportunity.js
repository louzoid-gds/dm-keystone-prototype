var moment = require('moment');
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
		howLongOpenFor: { type: Types.Number, default: 14 }, // number of days
		publishedAt: { type: Types.Datetime },
		closesAt: { type: Types.Datetime },
		productType: { type: Types.Relationship, ref: 'ProductType', filters: { isOpenToCompetition: true } },
		configurationAtCreation: { type: Types.Relationship, ref: 'OpportunityConfiguration' },
	},
	{ heading: 'Evaluation criteria' },
	{
		noOfSuppliersToEvaluate: { type: Types.Number },
		assessmentMethods: { type: Types.Relationship, ref: 'AssessmentMethod', many: true },
	}
);

// virtuals
Opportunity.schema.virtual('basicsComplete').get(function () {
	return this.title !== '' && this.summaryOfWork !== '';
});
Opportunity.schema.virtual('evaluationBasicsComplete').get(function () {
	return this.noOfSuppliersToEvaluate > 0; // && this.assessmentMethods;
});
Opportunity.schema.virtual('isPublished').get(function () {
	var d = moment(this.publishedAt);
	if (!d.isValid) return false;
	return d.isBefore(Date.now());
});
Opportunity.schema.virtual('isClosed').get(function () {
	var d = moment(this.closesAt);
	if (!d.isValid) return false;
	return d.isBefore(Date.now());
});
Opportunity.schema.virtual('isOpen').get(function () {
	return this.isPublished && !this.isClosed;
});

// methods
Opportunity.schema.methods.publish = function (callback) {
	var opportunity = this;
	if (opportunity.howLongOpenFor === '' || opportunity.howLongOpenFor === 0) {
		opportunity.howLongOpenFor = 14; // config setting somewhere
	}
	opportunity.publishedAt = Date.now();
	opportunity.closesAt = moment(Date.now()).add(this.howLongOpenFor, 'days'); // add howlongfor - how do we do that/
	opportunity.save(function (err) {
		if (err) return callback(err);
		callback();
	});
};

Opportunity.defaultSort = '-createdAt';
Opportunity.defaultColumns = 'title, productType, configurationAtCreation, publishedAt, closesAt, createdAt';

// reference responses here
Opportunity.relationship({ path: 'attributes', ref: 'AttributeValue', refPath: 'opportunity' });
Opportunity.relationship({ path: 'evaluationCriteria', ref: 'EvaluationCriteriaValue', refPath: 'opportunity' });
Opportunity.register();
