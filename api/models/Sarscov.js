/**
 * Users.js
 *
 * @description :: A model definition represents a database table/collection.
 * @docs        :: https://sailsjs.com/docs/concepts/models-and-orm/models
 */

 module.exports = {
	tableName: 'sarscov',
	primaryKey: 'id',
	attributes: {
		id: {
			type: 'number',
			unique: true,
			autoIncrement: true
		},
        taxon: {
            type: 'string'
        },
		pangolin_lineage: {
			type: 'string'
		},
		uhser_lineage: {
			type: 'string'
		},
		conflict: {
			type: 'string'
		},
		ambiguity_score: {
			type: 'string'
		},
		scorpio_call: {
			type: 'string'
		},
		scorpio_support: {
			type: 'string'
		},
		scorpio_conflict: {
			type: 'string'
		},
		version: {
			type: 'string'
		},
		pangolin_version: {
			type: 'string'
		},
		pangoLEARN_version: {
			type: 'string'
		},
		pango_version: {
			type: 'string'
		},
		status: {
			type: 'string'
		},
		note: {
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
	}
};

