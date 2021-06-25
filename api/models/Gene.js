/**
 * Gene.js
 *
 * @description :: A model definition represents a database table/collection.
 * @docs        :: https://sailsjs.com/docs/concepts/models-and-orm/models
 */

module.exports = {
  tableName: 'genes',
  primaryKey: 'id',
  attributes: {
    id: {
      type: 'string',
      unique: true,
      autoIncrement: true
    },
    name: {
      type: 'string'
    },
    full_name: {
      type: 'string'
    },
    summary: {
      type: 'string'
    },
    GHR_summary: {
      type: 'string'
    },
    GHR_metadata: {
      type: 'string'
    },
    NCBI_summary: {
      type: 'string'
    },
    NCBI_metadata: {
      type: 'string'
    },
    createdAt: {
      type: 'ref',
      columnType: 'timestamp',
      autoCreatedAt: true
    },
    updatedAt: {
      type: 'ref',
      columnType: 'timestamp',
      autoUpdatedAt: true
    }
  }

};

