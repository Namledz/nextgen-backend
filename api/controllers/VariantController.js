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
				let matchAnd = []
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

				if (filter.chrom) {
					matchAnd.push({ chrom: filter.chrom })
				}
				if (filter.gene) {
					matchAnd.push({ gene: filter.gene })
				}
				if (filter.function) {
					matchAnd.push({ codingEffect: filter.function })
				}
				if (filter.quality && filter.quality.type && filter.quality.value) {
					if (filter.quality.type === '>=') {
						matchAnd.push({ QUAL: { $gte: filter.quality.value } })
					} else {
						matchAnd.push({ QUAL: { $lte: filter.quality.value } })
					}
				}
				if (filter.gnomad && filter.gnomad.type && filter.gnomad.value) {
					if (filter.gnomad.type === '>=') {
						matchAnd.push({ gnomAD_exome_ALL: { $gte: filter.gnomad.value } })
					} else {
						matchAnd.push({ gnomAD_exome_ALL: { $lte: filter.gnomad.value } })
					}
				}
				if (filter.readDepth && filter.readDepth.type && filter.readDepth.value) {
					if (filter.readDepth.type === '>=') {
						matchAnd.push({ readDepth: { $gte: filter.readDepth.value } })
					} else {
						matchAnd.push({ readDepth: { $lte: filter.readDepth.value } })
					}
				}

				let match = ``


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

				let pipeline = []
				let pipeCount = []

				if (matchAnd.length > 0) {
					match = {
						$match: {
							$and: matchAnd
						}
					}

					pipeline.push(match)
					pipeCount.push(match)
				}

				//pipeline
				pipeline.push(JSON.parse(project))
				pipeline.push(JSON.parse(offset))
				pipeline.push(JSON.parse(limit))

				//pipecount
				pipeCount.push({ $group: { _id: null, count: { $sum: 1 } } })

				return Promise.all([collection.aggregate(pipeline, { allowDiskUse: true }).toArray(), collection.aggregate(pipeCount, { allowDiskUse: true }).toArray()])
			})
			.spread((data, count) => {
				return res.json({ items: data, total: count[0].count })
			})
			.catch(error => {
				console.log(error);
				return res.json({ items: [], total: 0 })
			})
	}

};

