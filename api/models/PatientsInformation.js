/**
 * PatientsInformation.js
 *
 * @description :: A model definition represents a database table/collection.
 * @docs        :: https://sailsjs.com/docs/concepts/models-and-orm/models
 */

module.exports = {
	tableName: 'patients_information',
	primaryKey: 'id',
	attributes: {
		id: {
			type: 'number',
			unique: true,
			autoIncrement: true
		},
		first_name: {
			type: 'string',
		},
		last_name: {
			type: 'string',
		},
		dob: {
			type: 'ref',
			columnType: 'timestamp',
		},
		phenotype: {
            type: 'string',
			columnType: 'text',
			allowNull: true
		},
		sample_id: {
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
	}

};

