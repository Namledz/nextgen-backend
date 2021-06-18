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
				let collection = database.collection('analysis_collection_1')
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
	}

};

