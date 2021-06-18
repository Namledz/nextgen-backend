
const mongo = sails.config.MONGO;
var mongodb= require('mongodb');
const MongodbService = require('../service/MongodbService');
var MongoClient= mongodb.MongoClient;


module.exports = {
    test: (req,res) => {
        let db;
        MongodbService.mongodbConnect()
            .then(function (mdb) {
                db = mdb;
                let database = db.db('genomics');
                database.collection('analysis_collection_1').find().toArray((err, results) => {
                    if(err) throw err;
                    console.log(results)
                    results.forEach(e => {

                    })
                });
            })
    }
}