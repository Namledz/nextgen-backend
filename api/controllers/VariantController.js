'use strict'

/**
 * VariantController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

const mongo = sails.config.MONGO;
var mongodb = require('mongodb');
var crypto = require("crypto");


module.exports = {
	variant: (req, res) => {
		let id = req.params.id;
		let searchTerm = req.body.searchTerm
		let filter = req.body.filter
		let grouping = req.body.grouping
		let sorting = req.body.sorting
		let column = sorting.column
		let sortOrder = sorting.direction
		let paginator = req.body.paginator
		let pageSize = paginator.pageSize ? paginator.pageSize : 10
		let page = paginator.page
		let skip = pageSize * (page - 1);


		let db;
		MongodbService.mongodbConnect()
			.then(function (mdb) {
				db = mdb;
				let database = db.db('genomics');
				let collectionName = `analysis_collection_${id}`;
				let collection = database.collection(collectionName);
				let match = ``
				let filter = ``
				let sort = ``
				let limit = `
					{
						"$limit": ${pageSize}
					}
				`
				let offset = `
					{
						"$skip" : ${skip}
					}
				`
				let project =
					`{
					"$project": {
						"gene": "$gene",
						"transcript_id": "$transcriptIds",
						"position": "$inputPos",
						"rsid": "$rsId",
						"REF": "$REF",
						"ALT": "$ALT",
						"cnomen": "$cNomen",
						"pnomen": "$pnomen",
						"function": "$codingEffect",
						"location": "$varLocation",
						"coverage": "$coverage",
						"gnomad": "$gnomAD_exome_ALL",
						"cosmicID": "$cosmicIds",
						"classification": "$CLINSIG_FINAL"
					}
				}`
				let pipeline = [
					JSON.parse(offset),
					JSON.parse(limit),
					JSON.parse(project)
				]

				return Promise.all([collection.aggregate(pipeline, { allowDiskUse: true }).toArray(), collection.countDocuments()])
			})
			.spread((data, count) => {
				return res.json({ items: data, total: count })
			})
			.catch(error => {
				console.log(error);
				return res.json({ items: [], total: 0 })
			})
	},
	getIgvInfo: (req, res) => {
		let analysisId = req.params.id;
		if (analysisId > 4) {
			analysisId -= 4;
		}
		let folderName = `sample${analysisId}`
		let user_ip = req.ip ? req.ip.replace(/::ffff:/g, "") : req.headers['x-real-ip'] ? req.headers['x-real-ip'] : undefined;
		user_ip = '27.3.67.166';

		Promise.all([VariantService.getIgvLink(`${folderName}/realigned.bam`, user_ip), VariantService.getIgvLink(`${folderName}/realigned.bam.bai`, user_ip)])
		.then(urls  => {
				let bamUrl = urls[0]
				let indexBamUrl = urls[1];
				return res.json({ status: 'success', data: { bamUrl: bamUrl, indexBamUrl: indexBamUrl } })
			})
			.catch(error => {
				console.log(error);
				return res.json({ status: 'error' })
			})
	}
};

