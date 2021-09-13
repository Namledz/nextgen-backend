/**
 * Samples.js
 *
 * @description :: A model definition represents a database table/collection.
 * @docs        :: https://sailsjs.com/docs/concepts/models-and-orm/models
 */

module.exports = {

	tableName: 'samples',
	primaryKey: 'id',
	attributes: {
		id: {
			type: 'number',
			unique: true,
			autoIncrement: true
		},
		user_id: {
			type: 'number',
		},
		name: {
			type: 'string',
			allowNull: true
		},
		data_type: {
			type: 'number'
		},
		control: {
			type: 'string',
			allowNull: true
		},
		genotype: {
			type: 'string',
			allowNull: true
		},
        file_size: {
            type: 'number',
            allowNull: true
        },
        file_type: {
            type: 'string',
            allowNull: true
        },
        complete_status: {
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

