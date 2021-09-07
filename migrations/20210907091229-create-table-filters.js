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
    db.createTable('filters', {
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
        user_id: {
            type: 'int',
            length: '11'
        },
        filter_string: {
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

exports.down = function (db, callback) {
    db.dropTable('filters', callback);
};

exports._meta = {
    "version": 1
};
