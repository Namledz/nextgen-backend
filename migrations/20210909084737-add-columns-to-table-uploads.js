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
    db.addColumn('uploads', 'sample_id', { type: 'int' }, callback)
	db.addColumn('uploads', 'fastq_pair_index', { type: 'int' }, callback)
    db.addColumn('samples', 'file_size', { type: 'bigint', length: 30 }, callback)
    db.addColumn('samples', 'file_type', { type: 'string' }, callback)
    db.addColumn('patients_information', 'sample_id', { type: 'int' }, callback)
    db.removeColumn('patients_information', 'upload_id', callback)
	db.removeColumn('uploads', 'sample_name', callback)
    db.removeColumn('analysis', 'upload_id', callback)
};

exports.down = function(db, callback) {
	db.removeColumn('uploads', 'sample_id', callback)
	db.removeColumn('uploads', 'fastq_pair_index', callback)
    db.removeColumn('samples', 'file_size', callback)
    db.removeColumn('samples', 'file_type', callback)
	db.removeColumn('uploads', 'sample_name', callback)
    db.removeColumn('patients_information', 'sample_id', callback)
    db.removeColumn('patients_information', 'upload_id', callback)
    db.removeColumn('analysis', 'upload_id', callback)
};

exports._meta = {
  "version": 1
};
