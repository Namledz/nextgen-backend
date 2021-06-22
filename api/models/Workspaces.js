/**
 * Workspaces.js
 *
 * @description :: A model definition represents a database table/collection.
 * @docs        :: https://sailsjs.com/docs/concepts/models-and-orm/models
 */

module.exports = {

	tableName: 'workspace',
	primaryKey: 'id',
	attributes: {
		id: {
			type: 'number',
			unique: true,
			autoIncrement: true
		},
		name: {
			type: 'string',
		},
    last_modified: {
			type: 'ref',
			columnType: 'timestamp',
    },
		user_created_id: {
			type: 'number',
		},
		number: {
			type: 'number'
		},
		pipeline: {
			type: 'string'
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

