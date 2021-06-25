/**
 * Samples.js
 *
 * @description :: A model definition represents a database table/collection.
 * @docs        :: https://sailsjs.com/docs/concepts/models-and-orm/models
 */

module.exports = {

	tableName: 'venn_datas',
	primaryKey: 'id',
	attributes: {
		id: {
			type: 'number',
			unique: true,
			autoIncrement: true
		},
		analysis_id: {
			type: 'number',
		},
		sample_ids: {
			type: 'number',
		},
		count: {
			type: 'number'
		},
		case: {
			type: 'string'
		},
		failed_ids: {
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

