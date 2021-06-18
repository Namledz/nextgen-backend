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
		let data = {
			name: 'Analysis 101'
		}
		return res.json({ status: 'success', data })
	}

};

