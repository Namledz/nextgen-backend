'use strict'
/**
 * AnalysisController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */
const PromiseBlueBird = require('bluebird');
const sqlString = require('sqlstring');
const moment = require('moment');

module.exports = {
	getAnalysisName: (req, res) => {
		let id = req.param('id');
		Analysis.findOne({ id: id })
			.then(a => {
				let data = {
					name: a.name,
					type: a.p_type,
					project_id: a.project_id
				}
				return res.json({ status: 'success', data })
			})
			.catch(error => {
				console.log("Error: ", error);
				return res.json({ status: 'error' })
			})
	},

	getAnalysisInfo: (req, res) => {
		let id = req.params.id;

		let queryStr = `
			SELECT 
				w.id as project_id,
				w.name as project,
				s.name as samples,
				s.id as sample_id,
				a.p_type
			FROM 
				analysis as a
			LEFT JOIN workspace as w 
			ON w.id = a.project_id
			LEFT JOIN samples as s	
			ON s.id = a.sample_id
			WHERE 
				a.id = ${id}
		`
		Analysis.getDatastore().sendNativeQuery(queryStr)
			.then(a => {
				let d = a.rows[0];
				if (d.p_type == 'vcf') {
					d.pipeline = 'DNA-Seq QC, Alignment (BWA)';
				} else {
					d.pipeline = 'DNA-Seq QC, Alignment (BWA)';
				}
				return res.json({ status: 'success', data: d })
			})
			.catch(error => {
				return res.json({ status: 'error', data: {} })
			})
	},

	list: (req, res) => {
		let id = req.params.id;
		let queryStr = `
			LEFT JOIN users as u
			ON a.user_id = u.id
			LEFT JOIN samples as s
			ON s.id = a.sample_id
			LEFT JOIN workspace as w
			ON a.project_id = w.id
            LEFT JOIN pipeline as p
            ON a.pipeline_id = p.id
			WHERE a.is_deleted = 0
			AND a.project_id = ${id}
		`

		let queryStringFind = `
			SELECT
				a.id,
				a.name,
				a.createdAt,
				a.updatedAt,
				u.email,
				u.role,
				s.name as sample_name,
				w.name as project_name,
				w.id as project_id,
				a.analyzed,
				a.variants,
				a.size,
				a.status,
				a.p_type as type,
                p.name as pipeline_name
			FROM 
				analysis as a
		${queryStr}
		`

		let queryStringCount = `
			SELECT COUNT (*) as total
			FROM
				analysis as a
			${queryStr}
		`

		PromiseBlueBird.all([Analysis.getDatastore().sendNativeQuery(queryStringFind), Analysis.getDatastore().sendNativeQuery(queryStringCount)])
			.spread((data, count) => {
				data.rows.forEach(e => {
					e.createdAt = `${moment(e.createdAt).format('MM/DD/YYYY')}`
					e.updatedAt = `${moment(e.updatedAt).format('MM/DD/YYYY')}`
					e.analyzed = e.status != Analysis.statuses.ANALYZED ? '' : `${moment(e.analyzed).format('MM/DD/YYYY')}`
					e.status = AnalysisService.getAnalysisStatus(e.status);
					e.size = e.size
				})
				return res.json({
					items: data.rows,
					total: count.rows[0].total
				})
			})
			.catch(error => {
				console.log("Error ", error)
				return res.json({
					items: [],
					total: 0
				})
			})
	},
	getVenndatas: (req, res) => {
		let d = req.body.data;
		let sampleIds = d.sampleIds;
		let analysisId = 726;
		sampleIds.sort(function (a, b) {
			return parseInt(a) - parseInt(b)
		});
		console.log(sampleIds);

		AnalysisService.getVenndatas(analysisId, sampleIds)
			.then(r => {
				let data = r[0]
				let resData = [];
				// console.log(r);
				let colors = {
					'6427': '#eb418b',
					'6428': '#9a96ec',
					'6429': '#f5d770',
					'6430': '#1BC5BD'
				}
				if (sampleIds.length == 3) {
					let a = data[0];
					let b = data[1];
					let c = data[3];
					resData = [
						{ name: a, value: 10, color: colors[sampleIds[0]]},
						{ name: b, value: 10, color: colors[sampleIds[1]] },
						{ name: data[2]/2, value: 3, sets: [a, b] },
						{ name: c, value: 10, color: colors[sampleIds[2]] },
						{ name: data[4]/2, value: 3, sets: [a, c] },
						{ name: data[5]/2, value: 3, sets: [b, c] },
						{ name: data[6]/3, value: 2, sets: [a, b, c] }
					];
				} else if (sampleIds.length == 2) {
					let a = data[0];
					let b = data[1];
					resData = [
						{ name: a, value: 10, color: colors[sampleIds[0]] },
						{ name: b, value: 10, color: colors[sampleIds[1]] },
						{ name: data[2]/2, value: 3, sets: [a, b] }
					]
				} else if (sampleIds.length == 1) {
					let a = data[0];
					resData = [
						{ name: a, value: 10, color: colors[sampleIds[0]] }
					]

				}
				// console.log(1);
				// console.log(resData);
				return res.json({ status: 'success', data: resData });
			})
			.catch(error => {
				console.log(error);
				return res.json({ status: 'error' });
			})
	},

	getAnalysesList: (req, res) => {
		let id = req.params.id;
		let queryStr = `
			LEFT JOIN users as u
			ON a.user_id = u.id
			LEFT JOIN workspace as w
			ON a.project_id = w.id
		`

		let queryStringFind = `
			SELECT
				a.id,
				a.name,
				a.createdAt,
				a.updatedAt,
				u.email,
				u.role,
				w.name as project_name,
				w.id as project_id,
				a.status
			FROM 
				analyses_list as a
		${queryStr}
		`

		let queryStringCount = `
			SELECT COUNT (*) as total
			FROM
				analyses_list as a
			${queryStr}
		`

		PromiseBlueBird.all([AnalysesList.getDatastore().sendNativeQuery(queryStringFind), AnalysesList.getDatastore().sendNativeQuery(queryStringCount)])
			.spread((data, count) => {
				data.rows.forEach(e => {
					e.createdAt = `${moment(e.createdAt).format('MM/DD/YYYY')}`
					e.updatedAt = `${moment(e.updatedAt).format('MM/DD/YYYY')}`
					e.status = e.status == 2 ? 'Analyzed' : ''
				})
				return res.json({
					items: data.rows,
					total: count.rows[0].total
				})
			})
			.catch(error => {
				console.log("Error ", error)
				return res.json({
					items: [],
					total: 0
				})
			})
	},

	deleteAnalysis: (req,res) => {
		let id = req.params.id

		return Analysis.update({id}, {is_deleted: 1})
        .then(result => {
            return res.json({
                status: 'success',
                message: 'Deleted successfully!'
            })
        })
        .catch(error => {
            console.log(error)
            return res.json({ status: 'error' })
        })
	},
    
    getSamplesByProjectId: (req, res) => {

        return PromiseBlueBird.all([Pipelines.find(), Uploads.find({is_deleted: 0})])
            .spread((pipelineData, upload) => {
                if(pipelineData.length == 0) {
                    throw ResponseService.customError('No pipeline!');
                }
                else if(upload.length == 0) {
                    throw ResponseService.customError('No sample!');
                }
                else {
                    let pipeline = pipelineData.map(el => {
                        let obj = {
                            id: el.id,
                            pipeline_name: el.name + ' ' + el.version
                        }
                        return obj;
                    })
                    let responseSample = upload.map(el => {
                        let obj = {
                            id: el.id,
                            sample_name: el.sample_name
                        }
                        return obj;
                    })
                    return res.json({status: 'success', pipeline: pipeline, samples: responseSample})
                }
            })
            .catch(error => {
				if (ResponseService.isCustomError(error)) {
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

    createAnalysis: async (req, res) => {
        let data = req.body;

        return Uploads.findOne({ id: data.upload_id })
            .then((upload) => {
                data.user_id = req.user.id;
                data.p_type = upload.file_type;
                data.size = upload.file_size;
                data.status = Analysis.statuses.QUEUING;

                return AnalysisService.createAnalysis(data)
            })
            .then((analysis) => {
                return res.json({
                    status: 'success',
                    message: 'Create analysis successfully!'
                })
            })
            .catch((error) => {
                console.log(error);
                return res.json({status: 'error'})
            })

    }
};

