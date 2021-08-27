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
const PromiseBlueBird = require('bluebird');


module.exports = {
	getPendingSample: (req, res) => {
		SampleService.getPending()
			.then(result => {
				return res.json({ status: 'success', data: result })
			})
			.catch(error => {
				if (ResponseService.isCustomError(error)) {
					return res.json({ status: 'success' })
				}
				console.log("Error-VepController@getPendingSample", error);
				return res.json({ status: 'error' })
			})
	},

	updateSampleStatus: async (req, res) => {
		// '/vep/update-sample-status/completed': '',
		// '/vep/update-sample-status/synchronizing': '',
		let sampleId = req.query.sample_id || 0;
		let status = req.param('status') || 'pending';
		let statusUpdate;


		if (status == 'error') {
			statusUpdate = Analysis.statuses.ERROR;
		} else if (status == 'completed') {
			statusUpdate = Analysis.statuses.VEP_ANALYZED;
		} else if (status == 'synchronizing') {
			statusUpdate = Analysis.statuses.QUEUING
		} else {
			statusUpdate = Analysis.statuses.QUEUING
		}
		console.log(sampleId);
		try {
			let analysis = await Analysis.update({ id: sampleId }, { status: statusUpdate }).fetch()

			return res.json({ status: 'success', data: analysis})
		}
		catch (error) {
			console.log("Error-VepController@updateSampleStatus:", error)
			return res.json({ status: 'error' })
		}

	},



}