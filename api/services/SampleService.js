'use strict'

const crypto = require("crypto");
const PromiseBlueBird = require('bluebird');

module.exports = {
	getPending: async () => {
		let query = {
			where: {
				status: Analysis.statuses.QUEUING,
			},
			sort: [
				{ status: 'ASC' },
				{ createdAt: 'ASC' }
			],
			limit: 1
		}

		let sample = await Analysis.find(query);

		if (sample[0]) {
			let fileUploaded = await Uploads.findOne({ id: sample[0].upload_id });
			let updateSample;
			
			if (!fileUploaded) {
				updateSample = await Analysis.update({ id: sample[0].id }, { status: Analysis.statuses.ERROR })
				throw ResponseService.customError('Sample Error!');
			} else {
				let uploadName = fileUploaded.upload_name.substring(0, fileUploaded.upload_name.lastIndexOf('.vcf'));
				let filePath = `${sails.config.userFolder}/${sample[0].user_id}/${sample[0].id}/${uploadName}.anno`
				updateSample = await Analysis.update({ id: sample[0].id }, { status: Analysis.statuses.ANALYZING, file_path: filePath })
			}

			let data = {
				id: sample[0].id,
				bed_file: '',
				file_path: `${sails.config.userFolder}/${sample[0].user_id}/${sample[0].id}/${fileUploaded.upload_name}`,
				genome_build: 'hg19',
				vcf_type: 'WGS',
				user_id: sample[0].user_id,
				is_pgx: 'no'
			}

			return data;
		}
		throw ResponseService.customError('No sample!');

	},


	createSample: (fileUploaded) => {
		let sampleName = fileUploaded.sample_name.substring(0, fileUploaded.sample_name.lastIndexOf(`.${fileUploaded.file_type}`));

		let data = {
			user_id: fileUploaded.user_created,
			name: sampleName
		}

		return Samples.create(data).fetch()
	}
}