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
	db.createTable('uploads', {
		id: {
			type: 'int',
			primaryKey: true,
			unique: true,
			autoIncrement: true,
			length: 11
		},
		original_name: {
			type: 'string'
		},
		sample_name: {
			type: 'string'
		},
		file_size: {
			type: 'string'
		},
		file_type: {
			type: 'string'
		},
		upload_name: {
			type: 'string'
		},
		is_deleted: {
			type: 'int'
		},
		workspace: {
			type: 'int'
		},
    file_path: {
      type: 'string'
    },
    user_created: {
      type: 'int'
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
	return db.dropTable('uploads', callback);
};

exports._meta = {
  "version": 1
};
