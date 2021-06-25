/**
 * Genepli.js
 *
 * @description :: A model definition represents a database table/collection.
 * @docs        :: https://sailsjs.com/docs/concepts/models-and-orm/models
 */

module.exports = {
  tableName: 'gene_pli',
  primaryKey: 'id',
  attributes: {
    id: {
      type: 'string',
      unique: true,
      autoIncrement: true
    },
    transcript: {
      type: 'string'
    },
    gene: {
      type: 'string'
    },
    chr: {
      type: 'string'
    },
    n_exons: {
      type: 'string'
    },
    n_syn: {
      type: 'string'
    },
    n_mis: {
      type: 'string'
    },
    n_lof: {
      type: 'string'
    },
    exp_syn: {
      type: 'string'
    },
    exp_mis: {
      type: 'string'
    },
    exp_lof: {
      type: 'string'
    },
    syn_z: {
      type: 'string'
    },
    mis_z: {
      type: 'string'
    },
    lof_z: {
      type: 'string'
    },
    pLI: {
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

