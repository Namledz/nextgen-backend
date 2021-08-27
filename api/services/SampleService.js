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

		console.log(123);
		let sample = await Analysis.find(query);

		console.log(sample);

		if (sample[0]) {
			let updateSample = await Analysis.update({ id: sample[0].id }, { status: Analysis.statuses.ANALYZING })
			let fileUploaded = await Uploads.findOne({ id: sample[0].upload_id });

			if (!fileUploaded) {
				updateSample = await Analysis.update({ id: sample[0].id }, { status: Analysis.statuses.ERROR })
				throw ResponseService.customError('Sample Error!');
			}

			let data = {
				id: sample[0].id,
				bed_file: '',
				file_path: fileUploaded.file_path,
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
			.then(sample => {
				let analysisData = {
					user_id: sample.user_id,
					name: sample.name,
					sample_id: sample.id,
					project_id: fileUploaded.workspace,
					p_type: fileUploaded.file_type,
					size: fileUploaded.file_size,
					status: Analysis.statuses.QUEUING,
					upload_id: fileUploaded.id
				}
				return Analysis.create(analysisData).fetch()
			})
	}
}