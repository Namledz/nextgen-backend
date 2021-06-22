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
	db.createTable('workspace', {
		id: {
			type: 'int',
			primaryKey: true,
			unique: true,
			autoIncrement: true,
			length: 11
		},
		name: {
			type: 'string',
			length: '255'
		},
		last_modified: {
			type: 'timestamp',
			defaultValue: new String('CURRENT_TIMESTAMP')
		},
		user_created_id: {
			type: 'int',
			length: '11'
		},
		number: {
			type: 'int'
		},
		pipeline: {
			type: 'string'
		},
		createdAt: {
			type: 'timestamp',
			defaultValue: new String('CURRENT_TIMESTAMP')
		},
		updatedAt: {
			type: 'timestamp',
			defaultValue: new String('CURRENT_TIMESTAMP')
		}
	}, callback);
};

exports.down = function(db, callback) {
	db.dropTable('workspace', callback);
};

exports._meta = {
  "version": 1
};
