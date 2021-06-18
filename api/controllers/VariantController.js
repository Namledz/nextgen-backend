'use strict'

/**
 * VariantController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

const mongo = sails.config.MONGO;
var mongodb = require('mongodb');


module.exports = {
	variant: (req, res) => {
		let id = req.params.id;
		let db;
		MongodbService.mongodbConnect()
			.then(function (mdb) {
				db = mdb;
				let database = db.db('genomics');
				let pipeCount = `
					
				`;
				return new Promise(function (resolve, reject) {
					database.collection('analysis_collection_1').aggregate(pipeCount, { allowDiskUse: true }, function (err, counts) {
						if (err) {
							return reject(err)
						}

						return resolve(counts);
					})
				})
			})
			.then(results => {
				console.log(results);
				return res.json({ items: [], total: 0 })
			})
			.catch(error => {
				console.log(error);
			})
	}

};

