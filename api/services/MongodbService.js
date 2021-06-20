/**
 * MongodbService
 */
 'use strict'

 const Promise = require('bluebird');
 const MongoClient = require('mongodb').MongoClient;
 const ObjectId = require('mongodb').ObjectID;
 const mongo = sails.config.MONGO;
 const exec = require('child_process').exec;
 
 
 module.exports = {
     /**
      * Init connection
      * @return {object}
      */
     initConnection: function () {
         let urlConnect = 'mongodb://' + mongo.HOST + ':' + mongo.PORT + '/' + mongo.DB;
 
		 return MongoClient.connect(urlConnect, {
			 promiseLibrary: Promise, socketTimeoutMS: 360000, useUnifiedTopology: true
			})
             .then(function(db) {
                 let auth = true
 
                 if (mongo.USER && mongo.PASS) {
                     auth = db.admin().authenticate(mongo.USER, mongo.PASS)
                 }
                 return [db, auth];
             })
             .spread(function (db, auth) {
                 if (!auth) {
                     throw new Error(`MongoDB error: Unauthorized with user ${mongo.HOST}`);
                 }
 
                 global.GENOMICS_MONGODB = db
 
                 return global.GENOMICS_MONGODB
             })
     },
 
     /**
      * Connection to mogoDB
      * @return {Promise}
      */
     mongodbConnect: function() {
        return MongodbService.initConnection();
     }
 }
 