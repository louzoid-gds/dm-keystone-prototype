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
	map: { name: 'title' }
});

Opportunity.add({
	title: { type: Types.Text, required: true },
	description: { type: Types.Markdown, required: false },
	budgetRange: { type: Types.Text },
	additionalTerms: { type: Types.Textarea },
	noOfSuppliersToEvaluate: { type: Types.Number },
	publishedAt: { type: Types.Date },
	createdBy: { type: Types.Relationship, ref: 'User', index: true },
	createdAt: { type: Date, default: Date.now, noedit: true }
});

Opportunity.defaultSort = '-createdAt';
Opportunity.defaultColumns = 'title, createdAt';

//reference responses here
Opportunity.relationship({ path: 'opportunityAttributes', ref: 'OpportunityProductTypeOpportunityAttributeValue', refPath: 'opportunity' });
Opportunity.register();
