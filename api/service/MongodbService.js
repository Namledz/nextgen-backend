/**
 * MongodbService
 * @author Tuan.Ngo
 */
 'use strict'

 const Promise = require('bluebird');
 const MongoClient = require('mongodb').MongoClient;
 const ObjectId = require('mongodb').ObjectID;
 const mongo = sails.config.MONGO;
 const exec = require('child_process').exec;
 //const execPromise = require('child-process-promise').exec;
 //const randomstring = require("randomstring");
 //const __ = require('lodash');
 
 module.exports = {
     /**
      * Init connection
      * @return {object}
      */
     initConnection: function () {
         let urlConnect = 'mongodb://' + mongo.HOST + ':' + mongo.PORT + '/' + mongo.DB;
 
         return MongoClient.connect(urlConnect, {promiseLibrary: Promise, socketTimeoutMS: 360000})
             .then(function(db) {
                 let auth = true
 
                 if (mongo.USER && mongo.PASS) {
                     auth = db.admin().authenticate(mongo.USER, mongo.PASS)
                 }
                 console.log("234")
                 return [db, auth];
             })
             .spread(function (db, auth) {
                 if (!auth) {
                     throw new Error(`MongoDB error: Unauthorized with user ${mongo.HOST}`);
                 }
 
                 global.GENOMICS_MONGODB = db
                 global.GENOMICS_MONGODB.isAlive = true
                 global.GENOMICS_MONGODB.on('reconnect', function () {
                     global.GENOMICS_MONGODB.isAlive = true
                 })
                 global.GENOMICS_MONGODB.on('close', function () {
                     global.GENOMICS_MONGODB.isAlive = false
                 })
 
                 return global.GENOMICS_MONGODB
             })
     },
 
     /**
      * Connection to mogoDB
      * @return {Promise}
      */
     mongodbConnect: function() {
        //  if (GENOMICS_MONGODB === null) {
        //      return this.initConnection()
        //  } else {
        //      return new Promise(function (resolve, reject) {
        //          if (GENOMICS_MONGODB.isAlive) {
        //              return resolve(GENOMICS_MONGODB)
        //          }
 
        //          return reject('Unable to connect to mongodb.')
        //      })
        //  }
        return this.initConnection();
     },
 
    //  /**
    //   * Count total variants
    //   * @param  {integer} sampleId
    //   * @param  {object} value
    //   * @return {Promise}
    //   */
    //  countTotalVariants: function(sampleId, value) {
    //      let db
    //      return new Promise(function (resolve, reject) {
    //          MongodbService.mongodbConnect()
    //              .then(function(result) {
    //                  db = result
 
    //                  var mongoCollectionName = mongo.SAMPLE_PREFIX + sampleId;
    //                  var collection = db.collection(mongoCollectionName)
 
    //                  var conditions = {};
    //                  var exonicCondition = {varLocation: /exonic/};
 
    //                  if (value) {
    //                      conditions = {alleleFrequency: {"$gte": value.start/100, "$lte": value.end/100}};
    //                      exonicCondition['alleleFrequency'] = {"$gte": value.start/100, "$lte": value.end/100};
    //                  }
 
    //                  conditions = MongodbService.getSelectedVariant(conditions)
 
    //                  var genomics = collection.count(conditions);
    //                  var exonic = collection.count(exonicCondition);
 
    //                  return Promise.all([genomics, exonic])
    //              }).then(function(results) {
    //                  //db.close()
 
    //                  resolve({genomics: results[0], exonic: results[1]})
    //              }).catch(function (error) {
    //                  if (db)  {
    //                      //db.close()
    //                  }
 
    //                  reject(error)
    //              })
    //      })
    //  },
 
    //  /**
    //   * Get Variants from mongodb
    //   * @param  {integer} sampleId
    //   * @param  {integer} page
    //   * @param  {integer} limit
    //   * @return {object}
    //   */
    //  getVariants: function (sampleId, page, limit) {
    //      let serverConnection = 'mongodb://' + mongo.HOST + ':' + mongo.PORT + '/' + mongo.DB
    //      var offset = page * limit;
    //      return MongoClient.connect(serverConnection, mongo.USER, mongo.PASS)
    //          .then(function(db) {
    //              return Promise.all([db, db.admin().authenticate(mongo.USER, mongo.PASS)]);
    //          }).then(function(results) {
    //              var db = results[0];
    //              var auth = results[1];
    //              if (!auth) {
    //                  throw new Error('Not authorized');
    //              }
 
    //              var mongoCollectionName = mongo.SAMPLE_PREFIX + sampleId;
    //              var collection = db.collection(mongoCollectionName)
    //              var total = collection.count();
    //              var data = collection.find({}, {skip: offset, limit: limit}).toArray();
 
    //              return Promise.all([total, data])
    //          }).then(function(results) {
    //              return {total: results[0], data: results[1]};
    //          })
    //  },
 
    //  /**
    //   * Export variants to CSV file
    //   * @param  {object} sample
    //   * @param  {string} type
    //   * @return {Promise}
    //   */
    //  exportCSV: function (sample, type) {
    //      var id = sample.id;
    //      var path = sails.config.userFolder + '/' + sample.user_id + '/' + sample.id;
    //      var collectionName = mongo.SAMPLE_PREFIX + id;
    //      var fileName = '';
    //      var cmd = '';
    //      var filePath = '';
 
    //      var fields = 'chrom,readDepth,alleleFrequency,#id,inputPos,unannotatedReason,gene,geneId,geneDesc,goBioProcess,goCellComp,goMolFunc,transcript,strand,transLen,protein,Uniprot,varType,codingEffect,varLocation,assembly,gDNAstart,gDNAend,gNomen,cDNAstart,cDNAend,cNomen,pNomen,alt_pNomen,exon,intron,omimId,distNearestSS,nearestSSType,wtSSFScore,wtMaxEntScore,wtNNSScore,wtGSScore,wtHSFScore,varSSFScore,varMaxEntScore,varNNSScore,varGSScore,varHSFScore,nearestSSChange,localSpliceEffect,localSS_pos,localSS_wtMaxEntScore,localSS_wtNNSScore,localSS_wtHSFScore,localSS_varMaxEntScore,localSS_varNNSScore,localSS_varHSFScore,branchPointPos,branchPointChange,proteinDomain1,proteinDomain2,proteinDomain3,proteinDomain4,rsId,rsValidated,rsSuspect,rsValidations,rsValidationNumber,rsAncestralAllele,rsHeterozygosity,rsClinicalSignificance,rsMAF,rsMAFAllele,rsMAFCount,1000g_AF,1000g_AFR_AF,1000g_SAS_AF,1000g_EAS_AF,1000g_EUR_AF,1000g_AMR_AF,exacAltFreq_all,exacAltFreq_afr,exacAltFreq_amr,exacAltFreq_eas,exacAltFreq_sas,exacAltFreq_nfe,exacAltFreq_fin,exacAltFreq_oth,exacAltCount_all,exacAltCount_afr,exacAltCount_amr,exacAltCount_eas,exacAltCount_sas,exacAltCount_nfe,exacAltCount_fin,exacAltCount_oth,exacTotalCount_all,exacTotalCount_afr,exacTotalCount_amr,exacTotalCount_eas,exacTotalCount_sas,exacTotalCount_nfe,exacTotalCount_fin,exacTotalCount_oth,exacHomFreq_all,exacHomFreq_afr,exacHomFreq_amr,exacHomFreq_eas,exacHomFreq_sas,exacHomFreq_nfe,exacHomFreq_fin,exacHomFreq_oth,exacHomCount_all,exacHomCount_afr,exacHomCount_amr,exacHomCount_eas,exacHomCount_sas,exacHomCount_nfe,exacHomCount_fin,exacHomCount_oth,exacFilter,exacReadDepth,espRefEACount,espRefAACount,espRefAllCount,espAltEACount,espAltAACount,espAltAllCount,espEAMAF,espAAMAF,espAllMAF,espEAAAF,espAAAAF,espAllAAF,espAvgReadDepth,clinVarIds,clinVarOrigins,clinVarMethods,CLINSIG,clinVarReviewStatus,clinVarPhenotypes,hgmdId,hgmdPhenotype,hgmdPubMedId,hgmdSubCategory,cosmicIds,cosmicTissues,cosmicFreqs,cosmicSampleCounts,insNucs,delNucs,substType,wtNuc,varNuc,nucChange,phastCons,phyloP,wtAA_1,wtAA_3,wtCodon,wtCodonFreq,varAA_1,varAA_3,varCodon,varCodonFreq,posAA,nOrthos,conservedOrthos,conservedDistSpecies,BLOSUM45,BLOSUM62,BLOSUM80,wtAAcomposition,varAAcomposition,wtAApolarity,varAApolarity,wtAAvolume,varAAvolume,granthamDist,AGVGDclass,AGVGDgv,AGVGDgd,SIFTprediction,SIFTweight,SIFTmedian,MAPPprediction,MAPPpValue,MAPPpValueMedian';
 
    //      if (type == 'genomic') {
    //          fileName = path + '/export_genomic.csv';
    //          filePath = sails.config.mountFolder + path + '/export_genomic.csv';
    //          cmd = `mongoexport --host ` +  mongo.HOST + ` --port `+ mongo.PORT +` -u ` + mongo.USER + ` -p ` + mongo.PASS + ` --authenticationDatabase admin --db ` + mongo.DB + ` --collection ` + collectionName + ` --type=csv --out ` + filePath  + ` --fields ` + fields;
    //      } else if ( type == 'exonic') {
    //          fileName = path + '/export_exon.csv';
    //          filePath = sails.config.mountFolder + path + '/export_exon.csv';
    //          cmd = `mongoexport --host ` +  mongo.HOST + ` --port `+ mongo.PORT +` -u ` + mongo.USER + ` -p ` + mongo.PASS + ` --authenticationDatabase admin --db ` + mongo.DB + ` --collection ` + collectionName + ` --type=csv --out ` + filePath + ` --fields ` + fields + ` -q "{'varLocation':'exonic'}"`;
    //      }
 
    //      let db
    //      return new Promise(function (resolve, reject) {
    //          MongodbService.mongodbConnect()
    //              .then(function(result) {
    //                  db = result
 
    //                  var collection = db.collection(collectionName)
 
    //                  return execPromise(cmd)
    //              })
    //              .then(function (result) {
    //                  //db.close()
 
    //                  var stdout = result.stdout;
    //                  var stderr = result.stderr;
    //                  if (stderr.indexOf('exported') != -1) {
    //                      resolve(fileName)
    //                  } else {
    //                      throw new Error(stderr)
    //                  }
    //              })
    //              .catch(function (error) {
    //                  if (db) {
    //                      //db.close()
    //                  }
 
    //                  reject(error)
    //              })
    //      })
    //  },
 
    //  /**
    //   * Dublicate mongodb database when share analysis or share sample
    //   * @param  {integer} sampleId
    //   * @param  {integer} toSampleId
    //   * @param  {string} type
    //   * @return {Promise}
    //   */
    //  dublicateDatabase: function (sampleId, toSampleId, type) {
    //      var fromCollection;
    //      var toCollection;
    //      if ( type == 'sample') {
    //          fromCollection = mongo.SAMPLE_PREFIX + sampleId;
    //          toCollection = mongo.SAMPLE_PREFIX + toSampleId;
    //      } else {
    //          fromCollection = mongo.ANALYSIS_PREFIX + sampleId;
    //          toCollection = mongo.ANALYSIS_PREFIX + toSampleId;
    //      }
 
    //      let db
    //      return new Promise(function (resolve, reject) {
    //          MongodbService.mongodbConnect()
    //              .then(function(result) {
    //                  db = result
    //                  var collection = db.collection(fromCollection)
 
    //                  var authenString = ' '
    //                  if (mongo.USER && mongo.PASS) {
    //                      authenString = ' -u ' + mongo.USER + ' -p ' + mongo.PASS + ' --authenticationDatabase admin'
    //                  }
 
    //                  var cmd = "mongoexport --host " + mongo.HOST + " --port " + mongo.PORT + authenString + ' --db ' + mongo.DB + " --collection " + fromCollection + " | mongoimport --host " + mongo.HOST + " --port " + mongo.PORT + authenString + " --db " + mongo.DB + " --collection " + toCollection;
 
    //                  exec(cmd, function (error, stdout, stderr) {
    //                      if (error) {
    //                          return reject(error)
    //                      }
 
    //                      if (stderr.indexOf('Failed') != -1 || stderr.indexOf('error') != -1) {
    //                          // Some error occured
    //                          return reject(stderr)
    //                      }
 
    //                      if (stderr.indexOf('imported') != -1) {
    //                          if (type == 'sample') {
    //                              var newCollection = db.collection(toCollection)
    //                              newCollection.updateMany({}, {$set: {sampleId: toSampleId}})
    //                          }
 
    //                          //db.close()
 
    //                          return resolve(toCollection)
    //                      } else {
    //                          throw new Error(stderr)
    //                      }
    //                  })
    //              })
    //              .then(result => {
    //                  if (type != 'sample') {
    //                      return result;
    //                  }
 
    //                  var authenString = ' '
    //                  if (mongo.USER && mongo.PASS) {
    //                      authenString = ' -u ' + mongo.USER + ' -p ' + mongo.PASS + ' --authenticationDatabase admin'
    //                  }
 
    //                  let duplicateCollection = (type) => {
    //                      let command = "mongoexport --host " + mongo.HOST + " --port " + mongo.PORT + authenString + ' --db ' + mongo.DB + " --collection " + fromCollection + `_${type}` + " | mongoimport --host " + mongo.HOST + " --port " + mongo.PORT + authenString + " --db " + mongo.DB + " --collection " + toCollection + `_${type}`;
 
    //                      return new Promise((resolve, reject) => {
    //                          exec(command, function (error, stdout, stderr) {
    //                              if (error) {
    //                                  return reject(error)
    //                              }
 
    //                              if (stderr.indexOf('Failed') != -1 || stderr.indexOf('error') != -1) {
    //                                  // Some error occured
    //                                  return reject(stderr)
    //                              }
 
    //                              if (stderr.indexOf('imported') != -1) {
    //                                  //db.close()
    //                                  return resolve(`${toCollection}_${type}`)
    //                              } else {
    //                                  throw new Error(stderr)
    //                              }
    //                          })
 
    //                      })
    //                  }
 
    //                  return [result, duplicateCollection("CNV"), duplicateCollection("SV")]
    //              })
    //              .catch(function (error) {
    //                  if (db) {
    //                      //db.close()
    //                  }
 
    //                  reject(error)
    //              })
    //      })
    //  },
 
    //  /**
    //   * Get variants to report
    //   * @param  {integer} id
    //   * @param  {string} type
    //   * @param  {array} variantIds
    //   * @return {Promise}
    //   */
    //  getVariantsToReport: function (id, type, variantIds, user, Variants) {
    //      // console.log(variants);
    //      var CHROM = [];
    //      var POS = [];
    //      var REF = [];
    //      var ALT = [];
    //      var GENE = [];
    //      for(let i in Variants){
    //          CHROM.push(Variants[i].chrom);
    //          if(Variants[i].pos) {
    //              POS.push(Variants[i].pos);
    //          }else {
    //              POS.push(Variants[i].inputPosInt);
    //          }
    //          if(Variants[i].ref){
    //              REF.push(Variants[i].ref);
    //          } else {
    //              REF.push(Variants[i].REF);
    //          }
    //          if(Variants[i].alt){
    //              ALT.push(Variants[i].alt);
    //          } else {
    //              ALT.push(Variants[i].ALT);
    //          }
    //          GENE.push(Variants[i].gene);
    //      }
    //      var collectionName = mongo.SAMPLE_PREFIX + id;
    //      if (type != 'sample') {
    //          collectionName = mongo.ANALYSIS_PREFIX + id;
    //      }
    //      var obj_ids = [''];
    //      if (variantIds != null) {
    //          obj_ids = variantIds.map(function(id) { return ObjectId(id); });
    //      }
 
    //      let db
 
    //      return new Promise(function (resolve, reject) {
    //          MongodbService.mongodbConnect()
    //              .then(function(result) {
    //                  db = result
 
    //                  var collection = db.collection(collectionName)
    //                  var conditions = {
    //                      "inputPos": {"$in": POS},
    //                      "REF":{"$in": REF},
    //                      "chrom":{"$in":CHROM},
    //                      "ALT":{"$in":ALT},
    //                      "gene":{"$in":GENE}
    //                      // "_id":{"$in": obj_ids}
    //                  };
    //                  // console.log(conditions);
    //                  collection.find(conditions, function (error, list) {
 
    //                      if (error) {
    //                          //db.close()
    //                          return reject(error)
    //                      }
 
    //                      list = list.toArray()
    //                      //db.close()
    //                      return resolve(list)
    //                  });
    //              })
    //              .catch(function (error) {
    //                  if (db) {
    //                      //db.close()
    //                  }
 
    //                  reject(error)
    //              })
    //      })
    //      .then(function (variants) {
    //          let classificationKey = []
    //          for (var i in variants) {
    //              let variant = variants[i]
    //              let key = `${variant.chrom}_${variant.inputPos}_${variant.REF}_${variant.ALT}_${user.organization_id}`
    //              classificationKey.push(key)
    //          }
 
    //          return [variants, MongodbService.getListClassification(classificationKey)]
 
    //      })
    //      .spread(function (variants, classifications) {
    //          for (var i in variants) {
    //              let variant = variants[i]
    //              let key = `${variant.chrom}_${variant.inputPos}_${variant.REF}_${variant.ALT}_${user.organization_id}`
    //              for (var j in classifications) {
    //                  let item = classifications[j]
    //                  if (key == item.key && item.classification != null && item.classification != "") {
    //                      variants[i].CLINSIG_FINAL = item.classification;
    //                  }
    //              }
    //          }
    //          return variants
    //      })
    //  },
 
    //  getPGxVariant: function (sampleId) {
    //      var collectionName = mongo.SAMPLE_PREFIX + sampleId;
    //      let db
 
    //      return new Promise(function (resolve, reject) {
    //          MongodbService.mongodbConnect()
    //              .then(function(result) {
    //                  db = result
 
    //                  var collection = db.collection(collectionName)
    //                  var conditions = {
    //                      "PGx": 1
    //                  };
 
    //                  collection.find(conditions, function (error, list) {
 
    //                      if (error) {
    //                          //db.close()
    //                          return reject(error)
    //                      }
 
    //                      list = list.toArray()
    //                      //db.close()
 
    //                      return resolve(list)
    //                  });
    //              })
    //              .catch(function (error) {
    //                  if (db) {
    //                      //db.close()
    //                  }
 
    //                  reject(error)
    //              })
    //      })
    //      .then(function (variants) {
    //          return variants
 
    //      })
    //  },
 
    //  /**
    //   * Get variants to report for CNV
    //   * @param  {integer} id
    //   * @param  {string} type
    //   * @param  {array} variantIds
    //   * @return {Promise}
    //   */
    //  getVariantsCnvToReport: function (id, type, variantIds, user) {
    //      var collectionName = mongo.SAMPLE_PREFIX + id + '_CNV';
    //      if (type != 'sample') {
    //          collectionName = mongo.ANALYSIS_PREFIX + id + '_CNV';
    //      }
    //      let db
    //      variantIds.map( (item) => {
    //          delete item.isSelected
    //          delete item._id
    //      });
 
 
    //      return new Promise(function (resolve, reject) {
    //          MongodbService.mongodbConnect()
    //              .then(function(result) {
    //                  db = result
 
    //                  var collection = db.collection(collectionName)
 
    //                  var conditions = {
    //                      '$or' : variantIds
    //                  };
 
    //                  collection.find(conditions, function (error, list) {
 
    //                      if (error) {
    //                          //db.close()
    //                          return reject(error)
    //                      }
 
    //                      list = list.toArray()
    //                      //db.close()
 
    //                      return resolve(list)
    //                  });
    //              })
    //              .catch(function (error) {
    //                  if (db) {
    //                      //db.close()
    //                  }
 
    //                  reject(error)
    //              })
    //      })
    //      .then(function (variants) {
    //          return variants
 
    //      })
    //  },
 
    //  /**
    //   * Get variant info
    //   * @param  {integer} id
    //   * @param  {string} type
    //   * @param  {array} variantIds
    //   * @return {Promise}
    //   */
    //  getVariantInfo: function (id, type, variantId) {
    //      var collectionName = mongo.SAMPLE_PREFIX + id;
    //      if (type != 'sample') {
    //          collectionName = mongo.ANALYSIS_PREFIX + id;
    //      }
 
    //      var variantObject = ObjectId(variantId);
 
    //      let db
 
    //      return new Promise(function (resolve, reject) {
    //          MongodbService.mongodbConnect()
    //              .then(function(result) {
    //                  db = result
 
    //                  var collection = db.collection(collectionName)
    //                  var conditions = {
    //                      "_id": variantObject
    //                  };
 
    //                  collection.find(conditions, function (error, list) {
 
    //                      if (error) {
    //                          //db.close()
    //                          return reject(error)
    //                      }
 
    //                      list = list.toArray()
    //                      //db.close()
 
    //                      return resolve(list)
    //                  });
    //              })
    //              .catch(function (error) {
    //                  reject(error)
    //              })
    //      })
    //  },
 
    //  getClassification: function (user, chrom, inputPos, REF, ALT, classification) {
    //      let db
    //      return new Promise(function (resolve, reject) {
    //          MongodbService.mongodbConnect()
    //              .then(function(result) {
    //                  db = result
 
    //                  var collection = db.collection('classification')
    //                  var conditions = {
    //                      "chrom": chrom,
    //                      "inputPos": inputPos,
    //                      "REF": REF,
    //                      "ALT": ALT,
    //                      "user_id": user.id,
    //                      "organization_id": user.organization_id
    //                  };
 
    //                  collection.find(conditions, function (error, list) {
 
    //                      if (error) {
    //                          //db.close()
    //                          return reject(error)
    //                      }
 
    //                      list = list.toArray()
 
    //                      //db.close()
 
    //                      return resolve(list)
    //                  });
    //              })
    //              .catch(function (error) {
    //                  console.log(error)
    //                  reject(error)
    //              })
    //      })
    //  },
 
    //  getListClassification: function (keyIds) {
    //      let db
    //      return new Promise(function (resolve, reject) {
    //          MongodbService.mongodbConnect()
    //              .then(function(result) {
    //                  db = result
 
    //                  var collection = db.collection('classification')
    //                  var conditions = {
    //                      "key": { $in: keyIds},
    //                      "classification" : { $ne: null }
    //                  };
 
    //                  collection.find(conditions, function (error, list) {
 
    //                      if (error) {
    //                          //db.close()
    //                          return reject(error)
    //                      }
 
    //                      list = list.toArray()
 
    //                      //db.close()
 
    //                      return resolve(list)
    //                  });
    //              })
    //              .catch(function (error) {
    //                  console.log(error)
    //                  reject(error)
    //              })
    //      })
    //  },
 
    //  addBedFile: function () {
    //      console.log('Add Bed file')
    //      let db
    //      let conditions = {
    //          $or: []
    //      }
    //      var lineReader = require('readline').createInterface({
    //          input: require('fs').createReadStream('/home/ubuntu/filter.tsv')
    //      });
 
    //      let count = 0;
 
    //      lineReader.on('line', function (line) {
    //          var variant = line.split("\t")
    //          var chrom = (isNaN(variant[0]) == true || variant[0] == "X" || variant[0] == "Y" ) ? variant[0] : parseInt(variant[0])
    //          var pos = parseInt(variant[1])
    //          var ref = variant[3]
    //          var alt = variant[4]
    //          count++;
 
    //          conditions['$or'].push({ chrom: chrom, inputPos: pos, REF: ref, ALT: alt})
    //          if (count == 1000) {
    //              count = 0
    //              lineReader.pause()
    //              MongodbService.mongodbConnect()
    //                  .then(function(result) {
    //                      let db = result
 
    //                      let collection = db.collection('sample_collection_1280')
 
    //                      collection.updateMany(conditions, { $set: { "bed_file7" : 1 } }, function (error, list) {
    //                          if (error) {
    //                              //db.close()
    //                              console.log(error)
    //                          } else {
    //                              conditions = {
    //                                  $or: []
    //                              }
    //                              console.log('next step')
    //                              lineReader.resume();
    //                          }
    //                      });
    //                  })
    //                  .catch(function (error) {
    //                      console.log(error)
    //                  })
    //          }
    //      });
 
    //      lineReader.on('close', function () {
    //          console.log('Close')
    //          if (count > 0) {
    //              console.log('Voday')
    //              MongodbService.mongodbConnect()
    //                  .then(function(result) {
    //                      let db = result
    //                      console.log(JSON.stringify(conditions))
    //                      let collection = db.collection('sample_collection_1280')
 
    //                      collection.updateMany(conditions, { $set: { "bed_file7" : 1 } }, function (error, list) {
    //                          if (error) {
    //                              //db.close()
    //                              console.log(error)
    //                          } else {
    //                             // lineReader.resume();
    //                      console.log('DONE..')
    //                          }
    //                      });
    //                  })
    //                  .catch(function (error) {
    //                      console.log(error)
    //                  })
    //          }
    //      })
    //  },
 
    //  updateMany: function (sampleId, conditions, fieldName) {
    //      let collectionName = `sample_collection_${sampleId}`
 
    //      let set = {}
    //      set[fieldName] = 1
    //      return new Promise(function (resolve2, reject2) {
    //          MongodbService.mongodbConnect()
    //              .then(function(result) {
    //                  let db = result
    //                  let collection = db.collection(collectionName)
 
    //                  collection.updateMany(conditions, { $set: set }, function (error, list) {
    //                      if (error) {
    //                          console.log(error)
    //                          return reject2(error)
    //                      } else {
    //                          return resolve2()
    //                      }
    //                  });
    //              })
    //      })
    //  },
 
    //  updateManyForCNV: function (sampleId, conditions, fieldName) {
    //      let collectionName = `sample_collection_${sampleId}_CNV`
    //      let set = {}
    //      set[fieldName] = 1
    //      return new Promise(function (resolve2, reject2) {
    //          MongodbService.mongodbConnect()
    //              .then(function(result) {
    //                  let db = result
    //                  let collection = db.collection(collectionName)
 
    //                  collection.updateMany(conditions, { $set: set }, function (error, list) {
    //                      if (error) {
    //                          console.log(error)
    //                          return reject2(error)
    //                      } else {
    //                          return resolve2()
    //                      }
    //                  });
    //              })
    //      })
    //  },
 
    //  updateClassification: function (user, isUpdate, chrom, inputPos, REF, ALT, classification) {
    //      let order = {
    //          "drug response": 6 ,
    //          "pathogenic": 5,
    //          "likely pathogenic": 4,
    //          "uncertain significance": 3,
    //          "likely benign": 2,
    //          "benign": 1
    //      }
    //      let db
    //      let userId = user.id;
    //      let organizationId = user.organization_id;
    //      return new Promise(function (resolve, reject) {
    //          MongodbService.mongodbConnect()
    //              .then(function(result) {
    //                  db = result
 
    //                  var collection = db.collection('classification')
    //                  var documentItem = {
    //                      "chrom": chrom,
    //                      "inputPos": inputPos,
    //                      "REF": REF,
    //                      "ALT": ALT,
    //                      "user_id": userId,
    //                      "organization_id": organizationId,
    //                      "classification": classification,
    //                      "order": order[classification],
    //                      "key": `${chrom}_${inputPos}_${REF}_${ALT}_${organizationId}`
    //                  };
 
    //                  if (isUpdate) {
    //                      if (classification != '') {
    //                          collection.update({
    //                                  "chrom": chrom,
    //                                  "inputPos": inputPos,
    //                                  "REF": REF,
    //                                  "ALT": ALT,
    //                                  "user_id": userId
    //                              },
    //                              {
    //                                  "chrom": chrom,
    //                                  "inputPos": inputPos,
    //                                  "REF": REF,
    //                                  "ALT": ALT,
    //                                  "user_id": userId,
    //                                  "classification": classification,
    //                                  "organization_id": organizationId,
    //                                  "order": order[classification],
    //                                  "key": `${chrom}_${inputPos}_${REF}_${ALT}_${organizationId}`
    //                              }, {multi: false}, function (error, item) {
 
    //                              if (error) {
    //                                  //db.close()
    //                                  return reject(error)
    //                              }
 
    //                              //db.close()
 
    //                              return resolve(item)
    //                          });
    //                      } else {
    //                          collection.remove({ "key": `${chrom}_${inputPos}_${REF}_${ALT}_${organizationId}` }, { single: false}, function (error, item) {
    //                              if (error) {
    //                                  //db.close()
    //                                  return reject(error)
    //                              }
 
    //                              //db.close()
 
    //                              return resolve(item)
    //                          })
    //                      }
    //                  } else {
    //                      collection.insert(documentItem, function (error, item) {
 
    //                          if (error) {
    //                              //db.close()
    //                              return reject(error)
    //                          }
 
    //                          //db.close()
 
    //                          return resolve(item)
    //                      });
    //                  }
    //              })
    //              .catch(function (error) {
    //                  console.log(error)
    //                  reject(error)
    //              })
    //      })
    //  },
 
    //  /**
    //   * Get read depth data
    //   * @param  {integer} sampleId
    //   * @param  {object} value
    //   * @param  {integer} maxValue
    //   * @return {Promise}
    //   */
    //  readDepthData: function(sampleId, value, maxValue) {
    //      var spaceReadDepth = sails.config.spaceReadDepth;
 
    //      let db
    //      return new Promise(function (resolve, reject) {
    //          MongodbService.mongodbConnect()
    //              .then(function(result) {
    //                  db = result
 
    //                  var collectionName = mongo.SAMPLE_PREFIX + sampleId;
    //                  var collection = db.collection(collectionName)
 
    //                  return [
    //                      collection,
    //                      Sample.findOne({id: sampleId})
    //                  ]
    //              })
    //              .spread(function (collection, sample) {
    //                  var maxNumber = 100;
    //                  var minNumber = 0;
    //                  if (maxValue) {
    //                      maxNumber = maxValue;
    //                  } else {
    //                      if (sample && !_.isEmpty(sample.read_depth) && sample.read_depth != 0) {
    //                          var numberReadDepth = sample.read_depth.split('|');
    //                          maxNumber = parseInt(numberReadDepth[1]);
    //                          minNumber = parseInt(numberReadDepth[0]);
    //                      }
    //                  }
 
    //                  var jump = (maxNumber - minNumber)/spaceReadDepth;
 
    //                  var arr = [];
    //                  for (var i = 0; i < spaceReadDepth; i++) {
    //                      arr.push(collection.count(MongodbService.getSelectedVariant({readDepth: {"$gte": jump*i + minNumber, "$lt": jump*(i + 1) + minNumber}, alleleFrequency: {$gte: value.start/100, $lte: value.end/100}})))
    //                  }
 
 
    //                  arr.push(collection.count(MongodbService.getSelectedVariant({})));
    //                  arr.push(jump);
    //                  arr.push(minNumber);
 
    //                  return arr
    //              })
    //              .each(function(result) {
 
    //              })
    //              .then(function(results) {
    //                  var datas = [];
    //                  var total = results[spaceReadDepth];
    //                  var jump = results[spaceReadDepth + 1];
    //                  var minNumber = results[spaceReadDepth + 2];
    //                  var sum = 0;
    //                  results.pop();
    //                  results.pop();
    //                  results.pop();
    //                  results.pop();
 
    //                  //db.close();
 
    //                  for (var i in results) {
    //                      datas.push([i, results[i], (results[i]/total)*100]);
    //                  }
 
    //                  resolve([datas, jump, minNumber]);
    //              })
    //              .catch(function (error) {
    //                  if (db) {
    //                      //db.close()
    //                  }
 
    //                  reject(error)
    //              })
    //      })
    //  },
 
    //  /**
    //   * Filter autocomplete options
    //   * @param  {integer} id
    //   * @param  {string} type
    //   * @return {Promise}
    //   */
    //  filterAutocompleteOption: function(id, type) {
    //      let db
 
    //      return new Promise(function (resolve, reject) {
    //          MongodbService.mongodbConnect()
    //              .then(function(result) {
    //                  db = result
 
    //                  var collectionName = mongo.SAMPLE_PREFIX + id;
    //                  if (type == 1) {
    //                      collectionName = mongo.ANALYSIS_PREFIX + id;
    //                  }
    //                  var collection = db.collection(collectionName)
 
    //                  var arr = [];
 
    //                  // Get option location
    //                  // arr.push(MongodbService.mongoFilterPromise(collection, "$varLocation"));
 
    //                  // Get option codingEffect
    //                  // arr.push(MongodbService.mongoFilterPromise(collection, "$codingEffect"));
 
    //                  // Get option CLINSIG
    //                  arr.push(MongodbService.mongoFilterPromise(collection, "$CLINSIG_FINAL"));
 
    //                  var readDepth = new Promise(function (resolve, reject) {
    //                      collection.aggregate([{
    //                          $group: {
    //                              _id: '',
    //                              readDepthMax: {
    //                                  $max: "$readDepth"
    //                              }
    //                          }
    //                      }],
    //                      {allowDiskUse: true},
    //                      function(err, results) {
    //                          //db.close();
 
    //                          if (err) {
    //                              return results = []
    //                          }
    //                          return resolve(results)
    //                      })
    //                  })
 
    //                  arr.push(readDepth);
 
    //                  return arr;
    //              }).each(function(result) {
 
    //              }).then(function(results) {
    //                  // var location = __.sortBy(results[0], [function(o) { return o._id; }]),
    //                      // codingEffect = __.sortBy(results[1], [function(o) { return o._id; }]),
    //                  var CLINSIG = __.sortBy(results[0], [function(o) {
    //                          if (o._id == 'drug response') {
    //                              return 0
    //                          } else if (o._id == 'pathogenic') {
    //                              return 1
    //                          } else if (o._id == 'likely pathogenic') {
    //                              return 2
    //                          } else if (o._id == 'uncertain significance') {
    //                              return 3
    //                          } else if (o._id == 'loss of function') {
    //                              return 6
    //                          } else if (o._id == 'likely benign') {
    //                              return 4
    //                          } else if (o._id == 'benign') {
    //                              return 5
    //                          } else {
    //                              return 6
    //                          }
    //                      }]),
    //                      readDepth = results[1];
 
    //                      var convertClin = [];
    //                      _.forEach(CLINSIG, function (item) {
    //                          if(item._id != null && item._id != 'loss of function') {
    //                              convertClin.push(item._id)
    //                          }
    //                      })
 
    //                      convertClin.push('loss of function');
 
    //                  // resolve({location: location, codingEffect: codingEffect, CLINSIG: convertClin, readDepthMax: readDepth});
    //                  resolve({CLINSIG: convertClin, readDepthMax: readDepth});
    //              })
    //              .catch(function (error) {
    //                  if (db) {
    //                      //db.close()
    //                  }
 
    //                  reject(error)
    //              })
    //      })
    //  },
 
    //  getSequenceOntologyFilterOpts: function (id, type) {
    //      let db
 
    //      return MongodbService.mongodbConnect()
    //              .then(function(result) {
    //                  db = result
 
    //                  var collectionName = mongo.SAMPLE_PREFIX + id;
    //                  if (type == 1) {
    //                      collectionName = mongo.ANALYSIS_PREFIX + id;
    //                  }
    //                  var collection = db.collection(collectionName)
 
    //                  var arr = [];
 
    //                  // Get option location
    //                  arr.push(MongodbService.mongoFilterPromise(collection, "$varLocation"));
 
    //                  // Get option codingEffect
    //                  arr.push(MongodbService.mongoFilterPromise(collection, "$codingEffect"));
    //                  return arr;
    //              }).spread(function(location, codingEffect)  {
    //                  var location = location,
    //                  codingEffect = codingEffect;
 
    //                  return {location: location, codingEffect: codingEffect};
    //              })
    //              .then(function (options) {
    //                  var location = [];
    //                  var codingEffect = [];
 
    //                  if (options.location.length > 0) {
    //                      for (var l in options.location) {
    //                          if (!_.isEmpty(options.location[l]._id)) {
    //                              var locationArray = options.location[l]._id.split(', ')
    //                              __.forEach(locationArray, function (item) {
    //                                  location.push(item);
    //                              })
    //                          }
    //                      }
    //                  }
 
    //                  if (options.codingEffect.length > 0) {
    //                      for (var c in options.codingEffect) {
    //                          if (!_.isEmpty(options.codingEffect[c]._id)) {
    //                              var codingEffectArray = options.codingEffect[c]._id.split(', ')
    //                              __.forEach(codingEffectArray, function (item) {
    //                                  codingEffect.push(item);
    //                              })
 
    //                          }
    //                      }
    //                  }
 
    //                  var variantOntology = FilterService.variantOntology();
    //                  var varLocation = FilterService.varLocation();
 
    //                  var selectCodingEffect = []
 
    //                  __.forEach(variantOntology, function (ontology, key) {
    //                      var checkExist = false;
    //                      __.forEach(codingEffect, function (item) {
    //                          if (ontology.indexOf(item) != -1) {
    //                              checkExist = true;
    //                          }
    //                      })
 
    //                      if (checkExist) {
    //                          selectCodingEffect.push(key)
    //                      }
    //                  })
 
    //                  __.forEach(varLocation, function (locationItem, key) {
    //                      var checkExist = false;
    //                      __.forEach(location, function (item) {
    //                          if (locationItem.indexOf(item) != -1) {
    //                              checkExist = true;
    //                          }
    //                      })
 
    //                      if (checkExist) {
    //                          selectCodingEffect.push(key)
    //                      }
    //                  })
 
    //                  var sequenceOntologyData = [
    //                      // Exon Groups
    //                      {
    //                          id: 'exonic',
    //                          text: 'Exon',
    //                          items: ['frameshift', 'inframe indel', 'start lost', 'start retained', 'nonframeshift', 'nonsynonymous SNV', 'synonymous SNV', 'stopgain', 'stoploss', 'stop retained', 'coding', 'missense', 'Protein altering variant']
    //                      },
    //                      {
    //                          id: 'frameshift',
    //                          text: 'Frameshift',
    //                          dad: 'exonic'
    //                      },
    //                      {
    //                          id: 'inframe indel',
    //                          text: 'Inframe indel',
    //                          dad: 'exonic'
    //                      },
    //                      {
    //                          id: 'missense',
    //                          text: 'Missense',
    //                          dad: 'exonic'
    //                      },
    //                      {
    //                          id: 'start lost',
    //                          text: 'Start loss',
    //                          dad: 'exonic'
    //                      },
    //                      {
    //                          id: 'start retained',
    //                          text: 'Start retained',
    //                          dad: 'exonic'
    //                      },
    //                      {
    //                          id: 'stopgain',
    //                          text: 'Stop gained',
    //                          dad: 'exonic'
    //                      },
    //                      {
    //                          id: 'stoploss',
    //                          text: 'Stop loss',
    //                          dad: 'exonic'
    //                      },
    //                      {
    //                          id: 'stop retained',
    //                          text: 'Stop retained',
    //                          dad: 'exonic'
    //                      },
    //                      {
    //                          id: 'synonymous SNV',
    //                          text: 'Synonymous',
    //                          dad: 'exonic'
    //                      },
    //                      {
    //                          id: 'coding',
    //                          text: 'Coding',
    //                          dad: 'exonic'
    //                      },
    //                      {
    //                          id: 'nonframeshift',
    //                          text: 'Nonframeshift',
    //                          dad: 'exonic'
    //                      },
    //                      {
    //                          id: 'nonsynonymous SNV',
    //                          text: 'Nonsynonymous',
    //                          dad: 'exonic'
    //                      },
    //                      {
    //                          id: 'Protein altering variant',
    //                          text: 'Protein altering variant',
    //                          dad: 'exonic'
    //                      },
    //                      // Intron
    //                      {
    //                          id: 'intronic',
    //                          text: 'Intron'
    //                      },
    //                      // Splicing group
    //                      {
    //                          id: 'splicing',
    //                          text: 'Splicing',
    //                          items: ['splice_site_variant', 'splice_region_variant', 'splice_acceptor', 'splice_donor']
    //                      },
    //                      {
    //                          id: 'splice_acceptor',
    //                          text: 'Splice acceptor',
    //                          dad: 'splicing'
    //                      },
    //                      {
    //                          id: 'splice_donor',
    //                          text: 'Splice donor',
    //                          dad: 'splicing'
    //                      },
    //                      {
    //                          id: 'splice_region',
    //                          text: 'Splice region',
    //                          dad: 'splicing'
    //                      },
    //                      {
    //                          id: 'splice_site_variant',
    //                          text: 'Splice site variant',
    //                          dad: 'splicing',
    //                          //show: true
    //                      },
    //                      {
    //                          id: 'splice_region_variant',
    //                          text: 'Splice region variant',
    //                          dad: 'splicing',
    //                          //show: true
    //                      },
    //                      // UTR
    //                      {
    //                          id: 'UTR',
    //                          text: 'UTR',
    //                          items: ['3UTR', '5UTR']
    //                      },
    //                      {
    //                          id: '3UTR',
    //                          text: "3` UTR",
    //                          dad: 'UTR'
    //                      },
    //                      {
    //                          id: '5UTR',
    //                          text: "5` UTR",
    //                          dad: 'UTR'
    //                      },
    //                      // regulatory_region
    //                      {
    //                          id: 'regulatory_region',
    //                          text: 'Regulatory Region',
    //                          items: ['TF_site', 'sub_requlatory_region']
    //                      },
    //                      {
    //                          id: 'TF_site',
    //                          text: 'TF site',
    //                          dad: 'regulatory_region'
    //                      },
    //                      {
    //                          id: 'sub_requlatory_region',
    //                          text: 'Regulatory region',
    //                          dad: 'regulatory_region'
    //                      },
    //                      // Upstream
    //                      {
    //                          id: 'upstream',
    //                          text: 'Upstream',
    //                          items: ['NMD', 'sub_upstream']
    //                      },
    //                      {
    //                          id: 'NMD',
    //                          text: 'NMD',
    //                          dad: 'upstream'
    //                      },
    //                      {
    //                          id: 'sub_upstream',
    //                          text: 'Upstream variant',
    //                          dad: 'upstream'
    //                      },
    //                      // Downstream
    //                      {
    //                          id: 'downstream',
    //                          text: 'Downstream'
    //                      },
    //                      // noncoding
    //                      {
    //                          id: 'noncoding',
    //                          text: 'Noncoding',
    //                          items: ['noncoding_exon', 'noncoding_intron']
    //                      },
    //                      {
    //                          id: 'noncoding_exon',
    //                          text: 'Noncoding exon',
    //                          dad: 'noncoding'
    //                      },
    //                      {
    //                          id: 'noncoding_intron',
    //                          text: 'Noncoding intron',
    //                          dad: 'noncoding'
    //                      },
 
    //                      // Intergenic
    //                      {
    //                          id: 'intergenic',
    //                          text: 'Intergenic'
    //                      },
    //                      // ncRNA_exonic
    //                      {
    //                          id: 'ncRNA_exonic',
    //                          text: 'ncRNA_exonic'
    //                      },
    //                      // ncRNA_intronic
    //                      {
    //                          id: 'ncRNA_intronic',
    //                          text: 'ncRNA_intronic'
    //                      },
    //                      // ncRNA_exonic
    //                      {
    //                          id: 'ncRNA_splicing',
    //                          text: 'ncRNA_splicing'
    //                      },
    //                      // Other
    //                      {
    //                          id: 'other',
    //                          text: 'Other'
    //                      }
    //                  ];
 
    //                  var hasSpliceAcceptor = true;
    //                  var hasSpliceDonor = true;
    //                  var hasSpliceRegion = true;
 
    //                  __.forEach(sequenceOntologyData, function (item) {
    //                      __.forEach(selectCodingEffect, function (value) {
    //                          if (item.id == value) {
    //                              item.show = true;
    //                              if (item.id == 'splice_acceptor') {
    //                                  hasSpliceAcceptor = false;
    //                              }
    //                              if (item.id == 'splice_donor') {
    //                                  hasSpliceDonor = false;
    //                              }
    //                              if (item.id == 'splice_region') {
    //                                  hasSpliceRegion = false;
    //                              }
    //                          }
    //                      })
    //                  })
 
    //                  var ontologyData = []
 
    //                  __.forEach(sequenceOntologyData, function (item) {
    //                      if (item.show == true) {
    //                          ontologyData.push(item)
    //                      } else if ((item.id == 'splice_site_variant' ||  item.id == 'splice_region_variant' ) && hasSpliceAcceptor && hasSpliceDonor && hasSpliceRegion ) {
    //                          ontologyData.push(item)
    //                      }
    //                  })
 
    //                  return ontologyData
    //              })
    //              .catch(function (error) {
    //                  return []
    //              })
    //  },
 
    //  /**
    //   * Mongo filter
    //   * @param  {object} collection
    //   * @param  {string} field
    //   * @return {Promise}
    //   */
    //  mongoFilterPromise: function(collection, field) {
    //      return new Promise(function (resolve, reject) {
    //          collection.aggregate([{
    //              $group: {
    //                  _id: field
    //              }
    //          }],
    //          {allowDiskUse: true},
    //          function(err, results) {
    //              if (err) {
    //                  //db.close();
 
    //                  return results = []
    //              }
    //              return resolve(results)
    //          })
    //      })
    //  },
 
    //  /**
    //   * Aggregate asyns
    //   * @param  {object} collection
    //   * @param  {object} pipe
    //   * @return {Promise}
    //   */
    //  aggregateAsync: function (collection, pipe) {
    //      return new Promise(function (resolve, reject) {
    //          collection.aggregate(pipe, {allowDiskUse: true}, function(err, result) {
    //              if (err) {
    //                  return reject(err)
    //              }
 
    //              return resolve(result);
    //          })
    //      })
    //  },
 
    //  getSelectedVariant: function (filterObject) {
    //      filterObject['selected_variant'] = { $ne: 0 }
    //      return filterObject
    //  },
 
    //  exportCSVindex: (sample) => {
    //      var id = sample.id;
    //      var path = sails.config.userFolder + '/' + sample.user_id
    //      // var collectionName = `variant_index_${sample.user_id}`;
    //      var collectionName = `variant_index_${sample.user_id}.csv`;
    //      var fileName = '';
    //      var cmd = '';
    //      var filePath = '';
 
    //      var fields = 'key,index';
    //      fileName = path + '/' + collectionName;
    //      filePath = sails.config.mountFolder + path + '/' + collectionName;
    //      cmd = `mongoexport --host ` + mongo.HOST + ` --port ` + mongo.PORT + ` --db ` + mongo.DB + ` --collection ` + collectionName + ` --type=csv --out ` + filePath + ` --fields ` + fields;
    //      console.log(cmd)
    //      let db
    //      return new Promise(function (resolve, reject) {
    //          MongodbService.mongodbConnect()
    //              .then(function(result) {
    //                  db = result
 
    //                  var collection = db.collection(collectionName)
 
    //                  return execPromise(cmd)
    //              })
    //              .then(function (result) {
    //                  //db.close()
 
    //                  var stdout = result.stdout;
    //                  var stderr = result.stderr;
    //                  if (stderr.indexOf('exported') != -1) {
    //                      resolve(filePath)
    //                  } else {
    //                      throw new Error(stderr)
    //                  }
    //              })
    //              .catch(function (error) {
    //                  if (db) {
    //                      //db.close()
    //                  }
 
    //                  reject(error)
    //              })
    //      })
    //  }
 }
 