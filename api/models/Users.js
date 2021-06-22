/**
 * Users.js
 *
 * @description :: A model definition represents a database table/collection.
 * @docs        :: https://sailsjs.com/docs/concepts/models-and-orm/models
 */

 module.exports = {
	tableName: 'users',
	primaryKey: 'id',
	attributes: {
		id: {
			type: 'number',
			unique: true,
			autoIncrement: true
		},
		username: {
			type: 'string'
		},
		first_name: {
			type: 'string'
		},
		last_name: {
			type: 'string'
		},
		email: {
			type: 'string',
		},
		password: {
			type: 'string',
			maxLength: 255
		},
		role: {
			type: 'number',
		},
		status: {
			type: 'number',
		},
		createdAt: {
			type: 'ref',
			columnType: 'timestamp',
			autoCreatedAt: true
		},
		updatedAt: {
			type: 'ref',
			columnType: 'timestamp',
			autoUpdatedAt: true
		}
	},
};

