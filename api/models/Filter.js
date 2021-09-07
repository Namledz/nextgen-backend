/**
 * Filter model
 */
'use strict'

module.exports = {
    tableName: 'filters',
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
            required: true
        },
        filter_string: {
            type: 'string',
            required: true
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
}