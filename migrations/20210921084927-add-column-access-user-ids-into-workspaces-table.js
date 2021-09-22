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
  db.addColumn('workspace', 'access_user_ids', { type: 'text' }, callback)
};

exports.down = function(db, callback) {
  db.removeColumn('workspace', 'access_user_ids', callback)
};

exports._meta = {
  "version": 1
};
