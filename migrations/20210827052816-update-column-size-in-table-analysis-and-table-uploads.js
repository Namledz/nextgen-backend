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
	db.changeColumn('analysis', 'size', {
		type: 'bigint',
		length: 30
	}, callback);
	db.changeColumn('uploads', 'file_size', {
		type: 'bigint',
		length: 30
	}, callback);
};

exports.down = function(db, callback) {
  return null;
};

exports._meta = {
  "version": 1
};
