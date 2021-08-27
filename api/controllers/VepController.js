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

			})
			.catch(error => {
				
			})
	},

	


}