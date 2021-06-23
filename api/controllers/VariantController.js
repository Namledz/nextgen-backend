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
				let collection = database.collection(`analysis_collection_${id}`)
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
					matchAnd.push({ chrom: { "$in": filter.chrom } })
				}
				if (filter.gene) {
					matchAnd.push({ gene: { "$in": filter.gene } })
				}
				if (filter.annotation) {
					matchAnd.push({ codingEffect: { "$in": filter.annotation } })
				}
				if (filter.classification) {
					matchAnd.push({ CLINSIG_FINAL: { "$in": filter.classification } })
				}
				if (filter.alleleFraction) {
					matchAnd.push({ alleleFrequency: filter.alleleFraction })
				}
				if (filter.gnomADfrom) {
					matchAnd.push({ gnomAD_exome_ALL: { $gte: filter.gnomADfrom } })
				}
				if (filter.gnomADto) {
					matchAnd.push({ gnomAD_exome_ALL: { $lte: filter.gnomADto } })
				}
				if (filter.depth_greater) {
					matchAnd.push({ readDepth: { $gte: filter.depth_greater } })
				}
				if (filter.depth_lower) {
					matchAnd.push({ readDepth: { $lte: filter.depth_lower } })
				}

				if (filter.function) {
					matchAnd.push({ codingEffect: filter.function })
				}
				if (filter.quality_greater) {
					matchAnd.push({ QUAL: { $gte: filter.quality_greater } })
				}
				if (filter.quality_lower) {
					matchAnd.push({ QUAL: { $lte: filter.quality_lower } })
				}

				let match = ``


				let project =
					`{
					"$project": {
						"gene": "$gene",
						"transcript_id": "$transcript",
						"position": "$inputPos",
						"chrom": "$chrom",
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
				if (db) {
					db.close();
				}
				return res.json({ items: data, total: count[0] ? count[0].count : 0 })
			})
			.catch(error => {
				if (db) {
					db.close();
				}
				console.log(error);
				return res.json({ items: [], total: 0 })
			})
	},
	getIgvInfo: (req, res) => {
		let analysisId = req.params.id;
		Analysis.findOne({ id: analysisId })
			.then(analysis => {
				let folderName = analysis.igv_local_path;
				// let user_ip = req.ip ? req.ip.replace(/::ffff:/g, "") : req.headers['x-real-ip'] ? req.headers['x-real-ip'] : undefined;
				let user_ip = req.headers['x-real-ip'] ? req.headers['x-real-ip'].replace(/::ffff:/g, "") : req.ip ? req.ip.replace(/::ffff:/g, "") : undefined;
				// user_ip = '27.3.67.166';

				return Promise.all([VariantService.getIgvLink(`${folderName}/realigned.bam`, user_ip), VariantService.getIgvLink(`${folderName}/realigned.bam.bai`, user_ip)])
			})
			.then(urls => {
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

