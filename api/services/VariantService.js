'use strict'

const crypto = require("crypto");

module.exports = {
	getIgvLink: (uri, client_ip) => {
		// uri example: '/igv/realigned.bam'
		if (!uri || !client_ip) {
			console.log("Error-CommonService@getIgvLink: IP address undefined")
			return undefined;
		}
		uri = "/user_files/6969/" + uri;
		console.log(client_ip)

		var url = "https://genetics.vn";
		var secret = "itisawsomekey1599";
		var today = new Date();
		var minute_exist = today.getMinutes() + 30;
		var expires = Math.round(new Date(today.getFullYear(), today.getMonth(), today.getDate(), today.getHours(), minute_exist, today.getSeconds()).getTime() / 1000);
		var input = uri + client_ip + expires + " " + secret;
		var binaryHash = crypto.createHash("md5").update(input).digest();
		var base64Value = new Buffer(binaryHash, "binary").toString('base64')
		var result = url + uri + "?" + "Signatures=" + base64Value.replace(/\+/g, "-").replace(/\//g, "_").replace(/\=/g, "") + "&Expires=" + expires;
		// console.log(result)
		return result;

	},

	sortVariants: (col) => {
		let t = {
			"id": "_id",
			"gene": "gene",
			"transcript_id": "transcript",
			"function": "codingEffect",
			"location": "varLocation",
			"coverage": "coverage",
			"gnomad": "gnomAD_exome_ALL",
			"classification": "CLINSIG_PRIORITY"
		}
	return t[col];
	}
}