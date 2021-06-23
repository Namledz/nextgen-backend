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
	db.addColumn('analysis', 'analyzed', { type: 'timestamp' }, callback)
	db.addColumn('analysis', 'variants', { type: 'int' }, callback)
	db.addColumn('analysis', 'size', { type: 'int' }, callback)
	db.addColumn('analysis', 'status', { type: 'int' }, callback)
};

exports.down = function(db, callback) {
	db.removeColumn('analysis', 'analyzed', callback)
	db.removeColumn('analysis', 'variants', callback)
	db.removeColumn('analysis', 'size', callback)
	db.removeColumn('analysis', 'status', callback)
};

exports._meta = {
  "version": 1
};
