var keystone = require('keystone');
var Types = keystone.Field.Types;

/**
 * AttributeGroup Model
 * Groups attributes together.  Hopefully sensibly!
 * =============
 */

var AttributeGroup = new keystone.List('AttributeGroup', {
	nocreate: false,
	noedit: false,
	track: true,
});

AttributeGroup.add({
	name: { type: Types.Text },
	label: { type: Types.Text },
	attributes: { type: Types.Relationship, ref: 'Attribute', many: true, filters: { usage: 'productField' }, note: 'Properties for the service listing and search' },
});

AttributeGroup.defaultSort = '-createdAt';
AttributeGroup.defaultColumns = 'name, createdAt';

AttributeGroup.register();
