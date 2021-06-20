'use strict'
/**
 * AnalysisController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

module.exports = {
	getAnalysisName: (req, res) => {
		let id = req.param('id');
		let name = `Analysis ${id}`;
		let data = {
			name: name,
			type: ''
		}
		if (id <= 4) {
			data.type = 'vcf'
		} else {
			data.type = 'fastq'
		}
		return res.json({ status: 'success', data })
	},

	getAnalysisInfo: (req, res) => {
		let id = req.params.id;
		let data = {
			pipeline: id <= 4 ? 'Variant calling(FreeBayes)' : 'DNA-Seq QC, Alignment (BWA)',
			project: 'Project 1',
			samples: `EX ${id <= 4 ? id : (id - 4)}`
		}	
		return res.json({ status: 'success', data: data })
	},

	list: (req, res) => {
		let data = [
			{
				id: 1,
				name: 'Analysis 1',
				owner: `info@genetics.vn`,
				type: 'vcf',
				sample: `EX1`,
				permission: 'admin',
				created: '06/20/2021',
				updated: '06/20/2021'
			},
			{
				id: 2,
				name: 'Analysis 2',
				owner: `info@genetics.vn`,
				type: 'vcf',
				sample: `EX2`,
				permission: 'admin',
				created: '06/20/2021',
				updated: '06/20/2021'
			},
			{
				id: 3,
				name: 'Analysis 3',
				owner: `info@genetics.vn`,
				type: 'vcf',
				sample: `EX3`,
				permission: 'admin',
				created: '06/20/2021',
				updated: '06/20/2021'
			},
			{
				id: 4,
				name: 'Analysis 4',
				owner: `info@genetics.vn`,
				type: 'vcf',
				sample: `EX4`,
				permission: 'admin',
				created: '06/20/2021',
				updated: '06/20/2021'
			},
			{
				id: 5,
				name: 'Analysis 5',
				owner: `info@genetics.vn`,
				type: 'fastq',
				sample: `EX1`,
				permission: 'admin',
				created: '06/20/2021',
				updated: '06/20/2021'
			},
			{
				id: 6,
				name: 'Analysis 6',
				owner: `info@genetics.vn`,
				type: 'fastq',
				sample: `EX2`,
				permission: 'admin',
				created: '06/20/2021',
				updated: '06/20/2021'
			},
			{
				id: 7,
				name: 'Analysis 7',
				owner: `info@genetics.vn`,
				type: 'fastq',
				sample: `EX3`,
				permission: 'admin',
				created: '06/20/2021',
				updated: '06/20/2021'
			},
			{
				id: 8,
				name: 'Analysis 8',
				owner: `info@genetics.vn`,
				type: 'fastq',
				sample: `EX4`,
				permission: 'admin',
				created: '06/20/2021',
				updated: '06/20/2021'
			},
		];
		return res.json({ items: data, total: 4 })
	}
};

