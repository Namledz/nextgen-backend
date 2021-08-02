/**
 * Users.js
 *
 * @description :: A model definition represents a database table/collection.
 * @docs        :: https://sailsjs.com/docs/concepts/models-and-orm/models
 */

 module.exports = {
	tableName: 'users',
	primaryKey: 'id',
	attributes: {
		id: {
			type: 'number',
			unique: true,
			autoIncrement: true
		},
		username: {
			type: 'string',
			allowNull: true
		},
		first_name: {
			type: 'string',
			allowNull: true
		},
		last_name: {
			type: 'string',
			allowNull: true
		},
		email: {
			type: 'string',
			allowNull: true
		},
		password: {
			type: 'string',
			maxLength: 255,
			allowNull: true
		},
		role: {
			type: 'number',
			allowNull: true
		},
		status: {
			type: 'number',
			allowNull: true
		},
		institution: {
			type: 'string',
			allowNull: true
		},
		group: {
			type: 'string',
			allowNull: true
		},
		user_created: {
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

	roles: {
		ADMIN: 0,
		USER: 1,
		LIST: [0, 1]
	},

	statuses: {
		ACTIVE: 0,
		DELETED: 1,
		DISABLED: 2,
		PENDING: 3,
		LIST: [0, 2, 3]
	},

	getUserStatus: (status) => {
		switch (status) {
			case 0:
				return 'Active'
			case 1:
				return 'Deleted'
			case 2:
				return 'Disabled'
			case 3:
				return 'Pending'
			default:
				return 'Unknow'
		}
	},

	getUserRole: (role) => {
		switch (role) {
			case 0:
				return 'Admin'
			case 1:
				return 'User'
			default:
				return 'Unknow'
		}
	},

	getUserStatusNumber: (status) => {
		switch (status) {
			case 'Active':
				return 0
			case 'Deleted':
				return 1
			case 'Disabled':
				return 2
			case 'Pending':
				return 3
			default:
				return 3
		}
	},

	getUserRoleNumber: (role) => {
		switch (role) {
			case 'Admin':
				return 0
			case 'User':
				return 1
			default:
				return 1
		}
	}


};

