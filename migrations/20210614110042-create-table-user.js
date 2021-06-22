'use strict';

var dbm;
var type;
var seed;

/**
  * We receive the dbmigrate dependency from dbmigrate initially.
  * This enables us to not have to rely on NODE_PATH.
  */
exports.setup = function(options, seedLink) {
  dbm = options.dbmigrate;
  type = dbm.dataType;
  seed = seedLink;
};

exports.up = function(db, callback) {
	db.createTable('users', {
		id: {
			type: 'int',
			primaryKey: true,
			unique: true,
			autoIncrement: true,
			length: 11
		},
		username: {
			type: 'string',
			length: 100
		},
		first_name: {
			type: 'string',
			length: 100
		},
		last_name: {
			type: 'string',
			length: 100
		},
		email: {
			type: 'string'
		},
		password: {
			type: 'string',
			length: 255,
			required: true
		},
		role: {
			type: 'int',
			length: 1
		},
		status: {
			type: 'int',
			length: 1
		},
		createdAt: {
			type: 'timestamp',
			defaultValue: new String('CURRENT_TIMESTAMP')
		},
		updatedAt: {
			type: 'timestamp',
			defaultValue: new String('CURRENT_TIMESTAMP')
		}
	}, callback)
};

exports.down = function(db, callback) {
	return db.dropTable('users', callback);
};

exports._meta = {
  "version": 1
};
