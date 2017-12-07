var keystone = require('keystone');
var Types = keystone.Field.Types;

/**
 * User Model
 * For purposes of early prototype, we're just assuming a sinlge indiv does everything = wrong!
 * To do - add in the concept of an 'org' or 'team'
 * ==========
 */
var User = new keystone.List('User');

User.add({
	name: { type: Types.Name, required: true, index: true },
	email: { type: Types.Email, initial: true, required: true, unique: true, index: true },
	password: { type: Types.Password, initial: true, required: true },
}, 'Permissions', {
	isAdmin: { type: Boolean, label: 'Can access Keystone', index: true },
	// bit like a default delivery address, reference a COPY of core terms
	// coreTerms: { type: Types.Relationship, ref: 'CoreTerms' },
});

// Provide access to Keystone
User.schema.virtual('canAccessKeystone').get(function () {
	return this.isAdmin;
});


/**
 * Registration
 */
User.defaultColumns = 'name, email, isAdmin';
User.register();
