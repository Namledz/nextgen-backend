/**
 * Users.js
 *
 * @description :: A model definition represents a database table/collection.
 * @docs        :: https://sailsjs.com/docs/concepts/models-and-orm/models
 */

 module.exports = {
	tableName: 'analysis',
	primaryKey: 'id',
	attributes: {
		id: {
			type: 'number',
			unique: true,
			autoIncrement: true
		},
        name: {
            type: 'string'
        },
		user_id: {
			type: 'number',
		},
		data_type: {
			type: 'number',
		},
		control: {
			type: 'string',
		},
		genotype: {
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

