var keystone = require('keystone');
var Types = keystone.Field.Types;

/**
 * Framework Model
 * Yep, frameworks are still a thing
 * =============
 */

var Framework = new keystone.List('Framework', {
	nocreate: false,
	noedit: false,
});

Framework.add({
	name: { type: Types.Text, required: true },
	liveAt: { type: Types.Date, required: true, initial: true },
	expiresAt: { type: Types.Date, required: true, initial: true },
	description: { type: Types.Markdown, required: false },
	productTypesToInclude: { type: Types.Relationship, ref: 'ProductType', many: true },
	createdAt: { type: Date, default: Date.now, noedit: true }
});

Framework.defaultSort = '-createdAt';
Framework.defaultColumns = 'name, createdAt';

Framework.register();
