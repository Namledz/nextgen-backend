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
            type: 'string',
			allowNull: true
        },
		user_id: {
			type: 'number',
		},
		data_type: {
			type: 'number',
			allowNull: true
		},
		control: {
			type: 'string',
			allowNull: true
		},
		genotype: {
			type: 'string',
			allowNull: true
		},
		igv_local_path: {
			type: 'string',
			allowNull: true
		},
		sample_id: {
			type: 'number'
		},
		project_id: {
			type: 'number'
		},
		p_type: {
			type: 'string',
			allowNull: true
		},
		analyzed: {
			type: 'ref',
			columnType: 'timestamp',
		},
		variants: {
			type: 'number'
		},
		size: {
			type: 'number'
		},
		status: {
			type: 'number'
		},
		variants_to_report: {
			type: 'string',
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

	statuses: {
		ANALYZED: 2
	}
};

