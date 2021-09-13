/**
 * Users.js
 *
 * @description :: A model definition represents a database table/collection.
 * @docs        :: https://sailsjs.com/docs/concepts/models-and-orm/models
 */

 module.exports = {
	tableName: 'uploads',
	primaryKey: 'id',
	attributes: {
		id: {
			type: 'number',
			unique: true,
			autoIncrement: true
		},
		original_name: {
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
		upload_name: {
			type: 'string',
			allowNull: true
		},
        is_deleted: {
			type: 'number',
			allowNull: true
		},
		file_path: {
			type: 'string',
			allowNull: true
		},
		user_created: {
			type: 'number',
			allowNull: true
		},
        sample_id: {
			type: 'number',
			allowNull: true
		},
        fastq_pair_index: {
            type: 'number',
            allowNull: true
        },
        upload_status: {
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


	file_types: {
		LIST : ['vcf','fastq']
	},

	getUploadStatus: (status) => {
		switch (status) {
			case 0:
				return 'Uploading'
			case 1:
				return 'Completed'
			case 2:
				return 'Error'
			default:
				return 'N/A'
		}
	},
};

