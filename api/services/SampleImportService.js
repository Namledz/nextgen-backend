'use strict'

const crypto = require("crypto");
const PromiseBlueBird = require('bluebird');
const exec = require('child_process').exec
const mongo = sails.config.MONGO;
const fs = require('fs');

module.exports = {
    checkAnalyzed: function () {
        var analysisInfo;

        return Analysis.findOne({ status: Analysis.statuses.IMPORTING })
            .then(function (importing) {
                if (importing) {
                    throw ResponseService.customError('Busy!.')
                }

                return Analysis.findOne({ status: Analysis.statuses.VEP_ANALYZED }) // Analyzed sample
            })
            .then(function (analysis) {
                if (!analysis) {
                    throw ResponseService.customError('No queued analysis.')
                }

                analysisInfo = analysis
                return Analysis.updateOne({ id: analysis.id }, { status: Analysis.statuses.IMPORTING })
            })
            .then(result => {
                // Start import sample
                SampleImportService.import(analysisInfo)

                return true
            })
            .catch(function (error) {
                if (ResponseService.isCustomError(error)) {
                    return
                }
                else {
                    console.log(error);
                    return
                }
            })
    },

    import: function (analysis) {
        let SERVER = sails.config.MONGO
        let collectionName = Analysis.getMongoCollectionName(analysis.id)
        let serverConnection = 'mongodb://' + SERVER.HOST + ':' + SERVER.PORT + '/' + SERVER.DB

        let file_path = `${sails.config.mountFolder}/${analysis.file_path}`

        return MongodbService.mongodbConnect()
            .then(function (db) {
                // let collection = db.collection(collectionName)

                let command;
                let authen = ''
                if (mongo.USER && mongo.PASS) {
                    authen = ` -u ${mongo.USER} -p ${mongo.PASS} --authenticationDatabase admin`
                }


                if (fs.existsSync(file_path)) {
                    command = `mongoimport --host ${SERVER.HOST} --port ${SERVER.PORT} ${authen} --db ${SERVER.DB} --collection ${collectionName} --type tsv --headerline --file ${file_path} --drop`
                }

                console.log(command)
                return new Promise(function (resolve, reject) {
                    exec(command, function (error, stdout, stderr) {
                        console.log(error, stdout, stderr)
                        if (error) {
                            throw reject(error)
                        }

                        if (stderr.indexOf('Failed') != -1 || stderr.indexOf('error') != -1) {
                            // Some error occured
                            console.log('Import Error error')
                            throw reject('Some error occured.')
                        }

                        return resolve(true)
                    })
                })
            })
            .then(function () {
                return SampleImportService.onImportSuccess(analysis)
            })
            .catch(function (error) {
                console.log('import error', error)
                return SampleImportService.onImportError(analysis)
            })
    },

    onImportSuccess: function (analysis) {
        let db;
        let collectionName = Analysis.getMongoCollectionName(analysis.id)

        return MongodbService.mongodbConnect()
            .then(function (mdb) {
                db = mdb
                let database = db.db('genomics');
                let collection = database.collection(collectionName)
                let pipeline = MongodbService.pipelineCountVariants()

                return new Promise(function (resolve, reject) {
                    collection.aggregate(pipeline, { allowDiskUse: true }).toArray(function (err, result) {
                        if (err) {
                            return reject(err)
                        }

                        return resolve(result);
                    })
                })
            })
            .then(count => {
                if (db) {
                    db.close();
                }
                let total = count[0] ? count[0].count : 0
                return Analysis.updateOne({ id: analysis.id }, { status: Analysis.statuses.ANALYZED, analyzed: new Date(), variants: total })
            })
    },

    onImportError: function (analysis) {
        return Analysis.updateOne({ id: analysis.id }, { status: Analysis.statuses.ERROR })
    },
}