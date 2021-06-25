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
					type: a.p_type
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
					d.pipeline = 'Variant calling(FreeBayes)';
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
			WHERE a.project_id = ${id}
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
				a.status
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
					e.analyzed = `${moment(e.analyzed).format('MM/DD/YYYY')}`
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
	getVenndatas: (req, res) => {
		let d = req.body.data;
		let sampleIds = d.sampleIds;
		let analysisId = 726;
		console.log(sampleIds);
		sampleIds.sort(function (a, b) {
			return parseInt(a) - parseInt(b)
		});

		AnalysisService.getVenndatas(analysisId, sampleIds)
			.then(r => {
				let data = r[0]
				let resData = [];
				console.log(r);
				if (sampleIds.length == 3) {
					let a = data[0];
					let b = data[1];
					let c = data[3];
					resData = [
						{ name: a, value: 10 },
						{ name: b, value: 10 },
						{ name: data[2], value: 3, sets: [a, b] },
						{ name: c, value: 10 },
						{ name: data[4], value: 3, sets: [a, c] },
						{ name: data[5], value: 3, sets: [b, c] },
						{ name: data[6], value: 2, sets: [a, b, c] }
					];
				} else if (sampleIds.length == 2) {
					let a = data[0];
					let b = data[1];
					resData = [
						{ name: a, value: 10 },
						{ name: b, value: 10 },
						{ name: data[2], value: 3, sets: [a, b] }
					]
				} else if (sampleIds.length == 1) {
					let a = data[0];
					resData = [
						{ name: a, value: 10 }
					]

				}
				console.log(resData);
				return res.json({ status: 'success', data: resData });
			})
			.catch(error => {

			})
	}
};

