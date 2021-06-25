'use strict'

const crypto = require("crypto");
const PromiseBlueBird = require('bluebird');
const combinatorics = require('js-combinatorics');;

module.exports = {
	getVenndatas: (analysisId, sampleIds) => {
		let cases = combinatorics.power(sampleIds)
		let caseLists = [];
		let arr = [];
		cases.forEach(function (item) {
			if (item.length > 0) {
				var textQuery = '';
				if (item.length == 1) {
					textQuery += ' AND `sample_ids` LIKE "%|' + item[0] + '|%"';
					if (sampleIds.length > 1) {
						for (var s in sampleIds) {
							if (item[0] != sampleIds[s]) {
								textQuery += ' AND `sample_ids` NOT LIKE "%|' + sampleIds[s] + '|%"';
							}
						}
					}
				} else {
					for (var i in item) {
						textQuery += ' AND `sample_ids` LIKE "%|' + item[i] + '|%"';
					}

					var diff = _.difference(sampleIds, item);
					if (diff.length > 0) {
						for (var d in diff) {
							textQuery += ' AND `sample_ids` NOT LIKE "%|' + diff[d] + '|%"';
						}
					}
				}

				caseLists.push(item.join('_'));

				var query = "SELECT `sample_ids`, `count`, `case`, `failed_ids` FROM venn_datas WHERE `analysis_id` = " + analysisId + textQuery;

				arr.push(Venn.getDatastore().sendNativeQuery(query).then(res => { return res.rows }));
			}
		});
		return PromiseBlueBird.all(arr)
			.then(function (rawVenn) {
				let vennData = {};
				caseLists.forEach(function (caseIds, caseIndex) {
					let key = caseIds;
					let count = 0;
					let resultItem = rawVenn[caseIndex];

					if (resultItem.length == 1) {
						var lengR = resultItem[0].sample_ids.split('|').length - 2;
						var lengC = caseIds.split('_').length;
						count = (resultItem[0].count / lengR) * lengC;
					} else if (resultItem.length > 0) {
						let lengR
						let lengC = caseIds.split('_').length;
						let itemIds

						resultItem.forEach(function (item) {
							lengR = item.sample_ids.split('|').length - 2
							count += (item.count / lengR) * lengC;
						})
					}

					vennData[caseIds] = vennData[caseIds] || 0
					vennData[caseIds] += count;
				})


				return vennData;
			})
			.then(vennData => {
				return AnalysisService.convert(vennData, sampleIds, sampleIds.length);
			})
	},

	convert: function (vennData, sampleIds, number) {

		var cases = combinatorics.power(sampleIds)
		var mapValue = [];
		var keys = [];

		cases.forEach(function (item) {
			if (item.length > 0) {
				mapValue.push(vennData[item.join('_')])
				keys.push(item.join('|'));
			}
		})

		return [mapValue, keys];
	}
}