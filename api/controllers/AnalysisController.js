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
			.spread((data,count) => {
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
		// let data = [
		// 	{
		// 		id: 1,
		// 		name: 'Analysis 1',
		// 		owner: `info@genetics.vn`,
		// 		type: 'vcf',
		// 		sample: `EX1`,
		// 		permission: 'admin',
		// 		created: '06/20/2021',
		// 		updated: '06/20/2021'
		// 	},
		// 	{
		// 		id: 2,
		// 		name: 'Analysis 2',
		// 		owner: `info@genetics.vn`,
		// 		type: 'vcf',
		// 		sample: `EX2`,
		// 		permission: 'admin',
		// 		created: '06/20/2021',
		// 		updated: '06/20/2021'
		// 	},
		// 	{
		// 		id: 3,
		// 		name: 'Analysis 3',
		// 		owner: `info@genetics.vn`,
		// 		type: 'vcf',
		// 		sample: `EX3`,
		// 		permission: 'admin',
		// 		created: '06/20/2021',
		// 		updated: '06/20/2021'
		// 	},
		// 	{
		// 		id: 4,
		// 		name: 'Analysis 4',
		// 		owner: `info@genetics.vn`,
		// 		type: 'vcf',
		// 		sample: `EX4`,
		// 		permission: 'admin',
		// 		created: '06/20/2021',
		// 		updated: '06/20/2021'
		// 	},
		// 	{
		// 		id: 5,
		// 		name: 'Analysis 5',
		// 		owner: `info@genetics.vn`,
		// 		type: 'fastq',
		// 		sample: `EX1`,
		// 		permission: 'admin',
		// 		created: '06/20/2021',
		// 		updated: '06/20/2021'
		// 	},
		// 	{
		// 		id: 6,
		// 		name: 'Analysis 6',
		// 		owner: `info@genetics.vn`,
		// 		type: 'fastq',
		// 		sample: `EX2`,
		// 		permission: 'admin',
		// 		created: '06/20/2021',
		// 		updated: '06/20/2021'
		// 	},
		// 	{
		// 		id: 7,
		// 		name: 'Analysis 7',
		// 		owner: `info@genetics.vn`,
		// 		type: 'fastq',
		// 		sample: `EX3`,
		// 		permission: 'admin',
		// 		created: '06/20/2021',
		// 		updated: '06/20/2021'
		// 	},
		// 	{
		// 		id: 8,
		// 		name: 'Analysis 8',
		// 		owner: `info@genetics.vn`,
		// 		type: 'fastq',
		// 		sample: `EX4`,
		// 		permission: 'admin',
		// 		created: '06/20/2021',
		// 		updated: '06/20/2021'
		// 	},
		// ];
		// return res.json({ items: data, total: 4 })
	}
};

