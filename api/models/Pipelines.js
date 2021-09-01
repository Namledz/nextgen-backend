/**
 * Pipelines.js
 *
 * @description :: A model definition represents a database table/collection.
 * @docs        :: https://sailsjs.com/docs/concepts/models-and-orm/models
 */

 module.exports = {

	tableName: 'pipeline',
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
		version: {
			type: 'string',
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

