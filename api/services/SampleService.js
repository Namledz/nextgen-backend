'use strict'

const crypto = require("crypto");
const PromiseBlueBird = require('bluebird');

module.exports = {
	getPending: () => {
		let query = {
			where: {
				vep_sync_times: { '<': 50 },
				status: [],
				is_delete: 0,
				sort: {
					status: 1,
					createdAt: 1
				}
			}
		}
	},


	// postFileInfor.user_created = user.id;
	// postFileInfor.file_path = `${sails.config.userFolder}/${user.id}/uploads/${postFileInfor.upload_name}`;
	// postFileInfor.is_deleted = 0;

	// console.log(postFileInfor);

	// 	// file_size: "0.02"
	// 	// file_type: "vcf"
	// 	// original_name: "100_line.vcf"
	// 	// sample_name: "100_line.vcf"
	// 	// upload_name: "xAVj5CfAT8VFOfzP4aDreLZz4rVFnC6b.vcf"
	// 	// workspace: 1
	createSample: (fileUploaded) => {
		let sampleName = fileUploaded.substring(0, fileUploaded.lastIndexOf(`.${fileUploaded.file_type}`));

		let data = {
			user_id: fileUploaded.user_created,
			name: sampleName
		}

		return Samples.create(data)
			.then(sample => {
				let analysisData = {
					user_id: sample.user_id,
					name: sample.name,
					sample_id: sample.id,
					project_id: fileUploaded.workspace,
					p_type: fileUploaded.file_type,
					size: fileUploaded.file_size,
					
				}
			})
	}
}