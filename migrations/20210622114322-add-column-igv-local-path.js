'use strict';

var dbm;
var type;
var seed;

/**
  * We receive the dbmigrate dependency from dbmigrate initially.
  * This enables us to not have to rely on NODE_PATH.
  */
exports.setup = function (options, seedLink) {
	dbm = options.dbmigrate;
	type = dbm.dataType;
	seed = seedLink;
};

exports.up = function (db, callback) {
	db.addColumn('analysis', 'igv_local_path', { type: 'string' }, callback)
	db.addColumn('analysis', 'sample_id', { type: 'int' }, callback)
	db.addColumn('analysis', 'project_id', { type: 'int' }, callback)
	db.addColumn('analysis', 'p_type', { type: 'string' }, callback)
};

exports.down = function (db, callback) {
	db.removeColumn('analysis', 'igv_local_path', callback)
	db.removeColumn('analysis', 'sample_id', callback)
	db.removeColumn('analysis', 'project_id', callback)
	db.removeColumn('analysis', 'p_type', callback)
};

exports._meta = {
	"version": 1
};
