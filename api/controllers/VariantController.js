'use strict'

/**
 * VariantController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

const numeral = require('numeral')
const moment = require('moment');
const randomstring = require("randomstring")
const fs = require('fs');
const exec = require('child_process').exec;
const Promise = require('bluebird');

module.exports = {
	variant: (req, res) => {
		let id = req.params.id;
		let searchTerm = req.body.searchTerm
		let filter = req.body.filter
		let grouping = req.body.grouping
		let sorting = req.body.sorting
		let column = sorting.column
		let sortOrder = sorting.direction == 'asc' ? 1 : -1;
		let paginator = req.body.paginator
		let pageSize = paginator.pageSize ? paginator.pageSize : 10
		let page = paginator.page
		let skip = pageSize * (page - 1);


		let db;
		return MongodbService.mongodbConnect()
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

				switch(filter.readDepthSign) {
					case 'greater':
						matchAnd.push({ readDepth: { $gte: filter.readDepth } })
						break;
					case 'lower':
						matchAnd.push({ readDepth: { $lte: filter.readDepth } })
						break;
					default:
						matchAnd.push({ readDepth: { $gte: 10 } })
				}

				switch(filter.AFSign) {
					case 'greater':
						matchAnd.push({ alleleFrequency: { $gte: filter.alleleFraction } })
						break;
					case 'lower':
						matchAnd.push({ alleleFrequency: { $lte: filter.alleleFraction } })
						break;
					default:
						matchAnd.push({ alleleFrequency: { $gte: 0.2 } })
				}

				switch(filter.gnomAdSign) {
					case 'greater':
						matchAnd.push({ gnomAD_exome_ALL: { $gt: filter.gnomAd } })
						break;
					case 'lower':
						matchAnd.push({ gnomAD_exome_ALL: { $lt: filter.gnomAd } })
						break;
					default:
						matchAnd.push({ gnomAD_exome_ALL: { $gt: 0 } })
				}


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
						"id": "$_id",
						"gene": "$gene",
						"transcript_id": "$transcript",
						"position": "$inputPos",
						"chrom": "$chrom",
						"rsid": "$rsId",
						"REF": "$REF",
						"ALT": "$ALT",
						"cnomen": "$cNomen",
						"pnomen": "$pNomen",
						"function": "$codingEffect",
						"location": "$varLocation",
						"coverage": "$coverage",
						"gnomad": "$gnomAD_exome_ALL",
						"gnomad_ALL": "$gnomAD_exome_ALL",
						"cosmicID": "$cosmicIds",
						"classification": "$CLINSIG_FINAL",
						"clinvar": "$Clinvar_VARIANT_ID",
						"gnomAD_AFR": "$gnomAD_exome_AFR",
						"gnomAD_AMR": "$gnomAD_exome_AMR",
						"Consequence": "$Consequence",
						"EXON": "$EXON",
						"INTRON": "$INTRON",
						"DOMAINS": "$DOMAINS",
						"gnomAD_genome_AMR": "$gnomAD_genome_AMR",
						"gnomADe_AMR": "$gnomADe_AMR",
						"CLINSIG": "$CLINSIG",
						"NEW_CLINSIG": "$NEW_CLINSIG",
						"CLNACC": "$CLNACC",
						"SOMATIC": "$SOMATIC",
						"cosmics": "$cosmics",
						"SIFT_score": "$SIFT_score",
						"Polyphen2_HDIV_score": "$Polyphen2_HDIV_score",
						"CADD_PHRED": "$CADD_PHRED",
						"PUBMED": "$PUBMED",
						"gold_stars": "$gold_stars",
						"review_status": "$review_status",
						"Clinvar_VARIANT_ID": "$Clinvar_VARIANT_ID",
						"gene_omim": "$gene_omim",
						"GeneSplicer": "$GeneSplicer",
						"gnomADe_AFR": "$gnomADe_AFR",
						"gnomAD_genome_AFR": "$gnomAD_genome_AFR",
						"1000g_AFR_AF": "$1000g_AFR_AF",
						"1000g_AMR_AF": "$1000g_AMR_AF",
						"gnomADe_EAS": "$gnomADe_EAS",
						"gnomAD_genome_EAS": "$gnomAD_genome_EAS",
						"gnomADe_SAS": "$gnomADe_SAS",
						"1000g_SAS_AF": "$1000g_SAS_AF",
						"gnomADe_ASJ": "$gnomADe_ASJ",
						"gnomAD_genome_ASJ": "$gnomAD_genome_ASJ",
						"gnomADe_FIN": "$gnomADe_FIN",
						"gnomAD_genome_FIN": "$gnomAD_genome_FIN",
						"1000g_EUR_AF": "$1000g_EUR_AF",
						"gnomADe_NFE": "$gnomADe_NFE",
						"gnomAD_genome_NFE": "$gnomAD_genome_NFE",
						"gnomADe_OTH": "$gnomADe_OTH",
						"gnomADe_ALL": "$gnomADe_ALL",
						"gnomAD_genome_ALL": "$gnomAD_genome_ALL",
						"1000g_AF": "$1000g_AF",
						"gnomAD_genome_OTH": "$gnomAD_genome_OTH",
						"CANONICAL": "$CANONICAL",
						"1000g_EAS_AF": "$1000g_EAS_AF",
						"HGNC_SYMONYMS": "$HGNC_SYMONYMS",
						"HGNC_PRE_SYMBOL": "$HGNC_PRE_SYMBOL"
					}
				}`

				let sort;
				if (VariantService.sortVariants(column)) {
					sort = `
					{
						"$sort": {
							"${VariantService.sortVariants(column)}" : ${sortOrder}
						}
					}
				`
				}

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
				if (sort) {
					pipeline.push(JSON.parse(sort))
				}
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
				let bamUrl = `https://varigenes-s3.s3.us-west-2.amazonaws.com/samples/${folderName}/realigned.bam`;
				let baiUrl = `https://varigenes-s3.s3.us-west-2.amazonaws.com/samples/${folderName}/realigned.bam.bai`;
				return [bamUrl, baiUrl]
				// return Promise.all([VariantService.getIgvLink(`${folderName}/realigned.bam`, user_ip), VariantService.getIgvLink(`${folderName}/realigned.bam.bai`, user_ip)])
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
	},

	getGeneDetail: (req, res) => {
		let geneName = req.body.gene;
		return Promise.all([Gene.findOne({ name: geneName }), Genepli.findOne({ gene: geneName })])
			.then(result => {
				let gene = result[0];
				let genePli = result[1]

				if (genePli) {
					genePli.exp_syn = numeral(genePli.exp_syn).format('0,0.0');
					genePli.exp_mis = numeral(genePli.exp_mis).format('0,0.0');
					genePli.exp_lof = numeral(genePli.exp_lof).format('0,0.0');
					genePli.syn_z = numeral(genePli.syn_z).format('0,0.00');
					genePli.mis_z = numeral(genePli.mis_z).format('0,0.00');
					genePli.lof_z = numeral(genePli.lof_z).format('0,0.00');
					genePli.pLI = numeral(genePli.pLI).format('0,0.00');

					genePli.pLI = genePli.pLI != "NaN" ? genePli.pLI : 0;
				}



				let geneInfo = {
					full_name: gene ? gene.full_name : "",
					genePli: genePli
				}

				if (gene.NCBI_summary != null) {
					geneInfo.function = gene.NCBI_summary
				} else if (gene.summary != null) {
					geneInfo.function = gene.summary
				} else if (gene.GHR_summary != '') {
					geneInfo.function = gene.GHR_summary
				}

				return res.json({ status: 'success', data: geneInfo })
			})
			.catch(err => {
				console.log(error);
				return res.json({ status: 'error' })
			})
	},
	selectVariantToReport: (req, res) => {
		let id = req.params.id;
		let variantsSelected = req.body.data;

		Analysis.findOne(id)
			.then((data) => {
				let variantToReport = data.variants_to_report ? JSON.parse(data.variants_to_report) : [];
				let newVariantToReport = [];
				for (let i in variantsSelected) {
					let check = true;
					let chrom_pos_ref_alt = variantsSelected[i].chrom + "_" + variantsSelected[i].pos + "_" + variantsSelected[i].ref + "_" + variantsSelected[i].alt + variantsSelected[i].gene;
					for (let j in variantToReport) {
						let chrom_pos_ref_alt_analysis = variantToReport[j].chrom + "_" + variantToReport[j].pos + "_" + variantToReport[j].ref + "_" + variantToReport[j].alt + variantToReport[j].gene;

						if (chrom_pos_ref_alt == chrom_pos_ref_alt_analysis) {
							check = false;
							break;
						}
					}
					if (check) {
						newVariantToReport.push(variantsSelected[i]);
					}
				}
				let arr = newVariantToReport.concat(variantToReport);
				return Analysis.update({ id: id }, { variants_to_report: JSON.stringify(arr) }).fetch()
			})
			.then((result) => {
				return res.json({ status: 'success', message: "Added to Report" })
			})
			.catch((err) => {
				console.log(err);
				return res.json({ status: 'error', message: "Unkown error" })
			})

	},

	getSeletedVariants: (req, res) => {
		let id = req.params.id;
		let chrom_pos_ref_alt_arr = [];
		let db;
		Analysis.findOne(id)
			.then((data) => {
				let variantToReport = data.variants_to_report ? JSON.parse(data.variants_to_report) : [];
				for (let i in variantToReport) {
					let chrom_pos_ref_alt_analysis = variantToReport[i].chrom + "_" + variantToReport[i].pos + "_" + variantToReport[i].ref + "_" + variantToReport[i].alt + "_" + variantToReport[i].gene;
					chrom_pos_ref_alt_arr.push(chrom_pos_ref_alt_analysis);
				}

				return new Promise((resolve, reject) => {
					MongodbService.mongodbConnect()
						.then(function (mdb) {
							db = mdb;
							let database = db.db('genomics');
							let collection = database.collection(`analysis_collection_${id}`)

							let project =
								`{
						"$project": {
							"_id": "$_id",
							"id": "$chrom_pos_ref_alt_gene",
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
							"classification": "$CLINSIG_FINAL",
							"clinvar": "$Clinvar_VARIANT_ID",
							"gnomAD_AFR": "$gnomAD_exome_AFR",
							"gnomAD_AMR": "$gnomAD_exome_AMR",
							"inheritance": "$inheritance"
						}
						}`

							let pipeline = [];
							let match = ``;
							match = {
								$match: {
									chrom_pos_ref_alt_gene: { "$in": chrom_pos_ref_alt_arr }
								}
							}
							pipeline.push(match)
							pipeline.push(JSON.parse(project))

							resolve(collection.aggregate(pipeline, { allowDiskUse: true }).toArray())
						})
				})
			})
			.then((data) => {
				if (db) {
					db.close();
				}
				return res.json({ items: data, total: 0 })
			})
			.catch((err) => {
				if (db) {
					db.close();
				}
				console.log(err);
				return res.json({ status: 'error', message: "Unkown error" })
			})
	},

	createReport: (req, res) => {
		let id = req.params.id;
		let variantSelected = req.body.selectedFilter;
		let templatePath = `pages/templates/report/report`;
		let patientInfor = {
			patientNo: "Undefinded",
			patientName: "John Cameroon",
			dob: moment().format('MM/DD/YYYY'),
			gender: "Male",
			ethnicity: "Asian"
		}

		let labInfor = {
			labName: "None",
			specimen: "Blood",
			receivedDate: moment().format('MM/DD/YYYY'),
			preparedBy: "None",
			reportedDate: moment().format('MM/DD/YYYY')
		}

		return new Promise(function (resolve, reject) {
			sails.renderView(templatePath, { patientInfor: patientInfor, variantSelected: variantSelected, labInfor: labInfor, layout: '/layouts/default_layout' }, function (err, view) {
				if (err) {
					return reject(err)
				}
				return resolve(view)
			})
		})
			.then((html) => {
				return res.json({ status: "success", html: html, message: "Created report successfully" })
			})
			.catch((err) => {
				console.log(err);
				return res.json({ status: 'error', message: "Unkown error" })
			})
	},

	exportReport: (req, res) => {
        let name = 'REPORT_' + randomstring.generate({ charset: 'numeric', length: 14 })
		let htmlFilePath = `${sails.config.mountFolder}/${sails.config.exportFolder}/${name}.html`;
		let exportFilePath = `${sails.config.mountFolder}/${sails.config.exportFolder}/${name}.pdf`;
        let header = req.body.header;
        let contentBody = req.body.contentBody;
		let footer = req.body.footer;
        let headerFilePath =`${sails.config.mountFolder}/${sails.config.exportFolder}/${name}_header.html`;
        let footerFilePath = `${sails.config.mountFolder}/${sails.config.exportFolder}/${name}_footer.html`;

        let command;
        if( header != null && footer != null) {
            command = 'wkhtmltopdf --page-size "Letter" --encoding "UTF-8"' + ' --header-html ' + headerFilePath + ' --footer-html ' + footerFilePath + ' ' + htmlFilePath + ' ' + exportFilePath
        }
        else {
			command = 'wkhtmltopdf --page-size "Letter" --encoding "UTF-8" -R 7.9mm -L 6.5mm -T 12.7mm -B 10.6mm ' + htmlFilePath + ' ' + exportFilePath;
        }
		console.log(command)

        let pattern = new RegExp('<grammarly-extension.*?>(.*?)<\\/grammarly-extension>','igm');
		let new_contentBody = contentBody.replace(pattern, '');

        return new Promise(function (resolve, reject) {
            sails.renderView( 'pages/templates/report/template' , {template: new_contentBody, layout : false}, function (err, view) {
                if (err) {
                    return reject(err)
                }
                return resolve(view)
            })
        })
        .then(view => {
            if(view) {
                let promises = [];
                let promise1 = new Promise(function (resolve, reject) {
                    fs.writeFile(htmlFilePath, view, function (err) {
                        if (err) {
                            return reject(err)
                        }
                        else {
                            return resolve()
                        }
                    })
                })
                promises.push(promise1)
                let promise2 = new Promise(function (resolve, reject) {
                    fs.writeFile(headerFilePath, header, function (err) {
                        if (err) {
                            return reject(err)
                        }
                        else {
                            return resolve()
                        }
                    })
                })
                promises.push(promise2)
                let promise3 = new Promise(function (resolve, reject) {
                    fs.writeFile(footerFilePath, footer, function (err) {
                        if (err) {
                            return reject(err)
                        }
                        else {
                            return resolve()
                        }
                    })
                })
                promises.push(promise3)
                return Promise.all(promises) 
            }
            else {
                let err = new Error('Generate Report Error!');
                err.isCustomError = true;
                throw err
            }
        })
        .then(function (data) {
            return new Promise(function (resolve, reject) {
                exec(command, function (err, stdout, stderr) {
                    if (err) {
                        return reject(err)
                    }
                    return resolve()
                })
            })
        })
        .then(function (data) {
            let urlDownload = `${sails.config.exportFolder}/${name}.pdf`;
            return s3Service.generateUrl(urlDownload)
        })
        .then(url => {
            return res.json({ status: "success", message: "Export Successfully!", url: url})
        })
		.catch(error => {
			if(error.isCustomError) {
				return res.json({
					status: 'error',
					message: error.message
				})
			}
			else {
				console.log(error);
				return res.json({ status: 'error' })
			}
		})
    },
};

