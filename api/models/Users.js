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
			type: 'string',
			allowNull: true
		},
		first_name: {
			type: 'string',
			allowNull: true
		},
		last_name: {
			type: 'string',
			allowNull: true
		},
		email: {
			type: 'string',
			allowNull: true
		},
		password: {
			type: 'string',
			maxLength: 255,
			allowNull: true
		},
		role: {
			type: 'number',
			allowNull: true
		},
		status: {
			type: 'number',
			allowNull: true
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

