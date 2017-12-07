var keystone = require('keystone');
var Types = keystone.Field.Types;

/**
 * Declaration Model
 * Rather pointless container object. Would fit nicely as a child object of application but that doesn't play nice with keystone
 * =============
 */

var Declaration = new keystone.List('Declaration', {
	nocreate: false,
	noedit: false,
	track: true,
});

Declaration.add({
	name: { type: Types.Text },
});

Declaration.defaultSort = '-createdAt';
Declaration.defaultColumns = 'createdAt';

// this is horribly messy.  OK for prototype though.  My new mantra.
Declaration.relationship({ path: 'frameworkSpecificTermValues', ref: 'AttributeValue', refPath: 'declaration' });
Declaration.relationship({ path: 'coreTermValues', ref: 'AttributeValue', refPath: 'declaration' });
Declaration.register();
