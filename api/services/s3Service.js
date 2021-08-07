'use strict'

const Promise = require('bluebird');
var AWS = require('aws-sdk');
AWS.config.setPromisesDependency(Promise);
AWS.config.update({ accessKeyId: sails.config.AWS_KEY, secretAccessKey: sails.config.AWS_SECRET });
AWS.config.region = 'us-west-2';



module.exports = {
	/**
	  * Delete object
	  * @param  {string} key
	  * @return {Promise}
	  */
	deleteObject: function (key) {
		let params = {
			Bucket: sails.config.AWS_BUCKET,
			Key: key
		}
		let s3 = new AWS.S3();
		return new Promise(function (resolve, reject) {
			console.log('start deleteObject')
			s3.deleteObject(params, function (err, data) {
				if (err) {
					return reject(err);
				} else {
					console.log('deleteObject success');
					return resolve(data);
				}
			});
		});
	},

	getSignedUrl: function (key, contentType) {
		let s3 = new AWS.S3();
		let params = {
			Bucket: sails.config.AWS_BUCKET,
			Expires: 60 * 60,
			ACL: 'public-read',
			Key: key,
			ContentType: contentType
		}

		return new Promise(function (resolve, reject){
			s3.getSignedUrl('putObject', params, function(err, data) {
				if (err) {
					return reject(err);
				} else {
					return resolve(data);
				}
			});
		})
	}
}
