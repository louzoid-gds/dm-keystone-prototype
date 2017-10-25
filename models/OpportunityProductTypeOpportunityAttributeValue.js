var keystone = require('keystone');
var Types = keystone.Field.Types;

/**
 * Opportunity product type attribute value Model
 * Product types have opportunity attributes, those attributes have values
 * =============
 */

var OpportunityProductTypeOpportunityAttributeValue = new keystone.List('OpportunityProductTypeOpportunityAttributeValue', {
	nocreate: false,
	noedit: false,
	map: { name: 'value' }
});

OpportunityProductTypeOpportunityAttributeValue.add({
	value: { type: Types.Text, required: true, initial: true },
	opportunity: { type: Types.Relationship, ref: 'Opportunity', initial: true, required: true },
	productTypeOpportunityAttribute: { type: Types.Relationship, ref: 'ProductTypeOpportunityAttribute', initial: true, required: true },
	createdAt: { type: Date, default: Date.now, noedit: true }
});

//ProductTypeAttributeValue.defaultSort = '-name';
OpportunityProductTypeOpportunityAttributeValue.defaultColumns = 'productTypeOpportunityAttribute, value, opportunity, createdAt';
OpportunityProductTypeOpportunityAttributeValue.register();
