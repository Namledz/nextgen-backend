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
    db.addColumn('uploads', 'upload_status', { type: 'int' }, callback)
	db.addColumn('samples', 'complete_status', { type: 'int' }, callback)
};

exports.down = function(db, callback) {
	db.removeColumn('uploads', 'upload_status', callback)
	db.removeColumn('samples', 'complete_status', callback)
};

exports._meta = {
  "version": 1
};
