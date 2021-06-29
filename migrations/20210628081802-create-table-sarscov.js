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
	db.createTable('sarscov', {
		id: {
			type: 'int',
			primaryKey: true,
			unique: true,
			autoIncrement: true,
			length: 11
		},
		taxon: {
			type: 'string'
		},
		pangolin_lineage: {
      type: 'string'
		},
		uhser_lineage: {
			type: 'string'
		},
		conflict: {
      type: 'string'
		},
		ambiguity_score: {
			type: 'string'
		},
    scorpio_call: {
      type: 'string'
    },
    scorpio_support: {
      type: 'string'
    },
    scorpio_conflict: {
      type: 'string'
    },
    version: {
      type: 'string'
    },
    pangolin_version: {
      type: 'string'
    },
    pangoLEARN_version: {
      type: 'string'
    },
    pango_version: {
      type: 'string'
    },
    status: {
      type: 'string'
    },
    note: {
      type: 'text'
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
	db.dropTable('sarscov', callback);
};

exports._meta = {
  "version": 1
};
