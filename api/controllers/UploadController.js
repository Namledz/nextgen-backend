
const PromiseBlueBird = require('bluebird');
const moment = require('moment');
const sqlString = require('sqlstring');

module.exports = {
	createMultipartUpload: (req, res) => {
        let uploadName = req.body.uploadName;
        let contentType = req.body.contentType;
        let user = req.user;

		let designation = `${sails.config.userFolder}/${user.id}/uploads/${uploadName}`;
        s3Service.createMultipartUpload(designation, contentType)
            .then(result => {
                return res.json({ status: 'success', uploadId: result.UploadId });
            }).catch(error => {
                console.log("Error@UploadController-createMultipartUpload: ", error);
                return res.json({ error: 'error' });
            })		
	},

    getSignedAuth: (req, res) => {
        let uploadName = req.body.uploadName;
        let partNumber = req.body.partNumber;
		let uploadId = req.body.uploadId;
        let user = req.user;

		let designation = `${sails.config.userFolder}/${user.id}/uploads/${uploadName}`;
        s3Service.getSignedUrl(designation, partNumber, uploadId)
            .then(result => {
                return res.json({ status: 'success', preSignedUrl: result });
            }).catch(error => {
                console.log("Error@UploadController-getSignedAuth: ", error);
                return res.json({ error: 'error' });
            })
	},

	completeMultipartUpload: (req, res) => {
		let uploadName = req.body.uploadName;
        let parts = req.body.parts;
		let uploadId = req.body.uploadId;
        let user = req.user;

		let designation = `${sails.config.userFolder}/${user.id}/uploads/${uploadName}`;
        s3Service.completeMultipartUpload(designation, parts, uploadId)
            .then(result => {
                return res.json({ status: 'success', result });
            }).catch(error => {
                console.log("Error@UploadController-completeMultipartUpload: ", error);
                return res.json({ error: 'error' });
            })
	},

    uploadFileInfor: (req, res) => {
        let postFileInfor = req.body;
        let user = req.user;
        let uploadId;

        let uploadInfor = {
            original_name: postFileInfor.original_name,
            file_size: postFileInfor.file_size,
            file_type: postFileInfor.file_type,
            upload_name: postFileInfor.upload_name,
            user_created: user.id,
            file_path: `${sails.config.userFolder}/${user.id}/uploads/${postFileInfor.upload_name}`,
            is_deleted: 0
        }

        let sampleInfor = {
            name: postFileInfor.sample_name,
            user_id: user.id,
            file_size: postFileInfor.file_size,
            file_type: postFileInfor.file_type
        }

        return Uploads.create(uploadInfor).fetch()
            .then(upload => {
                if(upload) {  
                    uploadId = upload.id;
                    return Samples.create(sampleInfor).fetch()
                }
                throw ResponseService.customError('There was an error creating the upload information!');
            })
            .then(sample => {
                if(sample) {
                    let patientInfor = {
                        first_name: postFileInfor.first_name,
                        last_name: postFileInfor.last_name,
                        dob: postFileInfor.dob,
                        phenotype: postFileInfor.phenotype,
                        sample_id: sample.id
                    }
                    return Promise.all([PatientsInformation.create(patientInfor).fetch(), Uploads.update({id: uploadId}, {sample_id: sample.id})])
                }
                throw ResponseService.customError('Sample created failed!');
            })
			.then(data => {
                return res.json({
                    status: 'success',
                    message: 'Successfully!'
                })
			})
            .catch(error => {
				if (ResponseService.isCustomError(error)) {
                    return res.json({
                        status: 'error',
                        message: error.message
                    })
                }
                else {
                    console.log(error);
                    return res.json({ status: 'error', message: 'Unkown Error!' })
                }
			})

    },

    createUploadFastQ: (req, res) => {
        let uploadInformation = req.body;
        let user = req.user;

        let uploadInfor = {
            original_name: uploadInformation.original_name,
            file_size: uploadInformation.file_size,
            file_type: uploadInformation.file_type,
            upload_name: uploadInformation.upload_name,
            user_created: user.id,
            file_path: `${sails.config.userFolder}/${user.id}/uploads/${uploadInformation.upload_name}`,
            is_deleted: 0
        }

        return Uploads.create(uploadInfor).fetch()
        .then(upload => {
            if(upload) {  
                return res.json({
                    status: 'success',
                    message: 'Successfully!',
                    uploadId: upload.id
                })
            }
            throw ResponseService.customError('There was an error creating the upload information!');
        })
        .catch(error => {
            if (ResponseService.isCustomError(error)) {
                return res.json({
                    status: 'error',
                    message: error.message
                })
            }
            else {
                console.log(error);
                return res.json({ status: 'error', message: 'Unkown Error!' })
            }
        })
    },

    createSampleFastQ: (req, res) => {
        let reqInfor = req.body;
        let user = req.user;

        let sampleInfor = {
            name: reqInfor.sample_name,
            user_id: user.id,
            file_size: reqInfor.file_size,
            file_type: reqInfor.file_type
        }
        return Samples.create(sampleInfor).fetch()
            .then(sample => {
                if(sample) {
                    let promises = [];
                    let patientInfor = {
                        first_name: reqInfor.first_name,
                        last_name: reqInfor.last_name,
                        dob: reqInfor.dob,
                        phenotype: reqInfor.phenotype,
                        sample_id: sample.id
                    }
                    reqInfor.forward.forEach((el, index) => {
                        promises.push(Uploads.update({id: el}, {sample_id: sample.id, fastq_pair_index: index}))
                    })

                    reqInfor.reverse.forEach((el, index) => {
                        promises.push(Uploads.update({id: el}, {sample_id: sample.id, fastq_pair_index: index}))
                    })

                    promises.push(PatientsInformation.create(patientInfor).fetch());
                    return Promise.all(promises)
                }
                throw ResponseService.customError('Sample created failed!');
            })
            .then(data => {
                return res.json({
                    status: 'success',
                    message: 'Successfully!'
                })
            })
            .catch(error => {
                if (ResponseService.isCustomError(error)) {
                    return res.json({
                        status: 'error',
                        message: error.message
                    })
                }
                else {
                    console.log(error);
                    return res.json({ status: 'error', message: 'Unkown Error!' })
                }
            })
    },


	find: (req,res) => {
		let searchTerm = req.body.searchTerm
		let filter = req.body.filter

		let sorting = req.body.sorting
		let column = sorting.column
		let direction = sorting.direction

		let paginator = req.body.paginator
		let pageSize = paginator.pageSize ? paginator.pageSize : 10
		let page = paginator.page
		let skip = pageSize * (page - 1)
		let searchFilter = ''
		let sortField = ''

		let type = filter.type ? filter.type : Uploads.file_types.LIST


		switch (column) {
			case 'name':
				sortField = `u.original_name ${direction}`
				break;
            case 'type':
                sortField = `u.file_type ${direction}`
                break;
            case 'size':
                sortField = `u.file_size ${direction}`
                break;
            case 'createdAt':
                sortField = `u.createdAt ${direction}`
                break;
			default:
				sortField = `u.${column} ${direction}`
		}

		let sqlSearchTerm = sqlString.escape('%' + searchTerm + '%')

		if (searchTerm != '') {
			searchFilter = ` AND ( u.original_name LIKE ${sqlSearchTerm}
				OR u.file_type LIKE ${sqlSearchTerm}
				OR w.name LIKE ${sqlSearchTerm}
				)`
		}

		let queryString = `
			WHERE
				u.is_deleted = 0
			AND u.file_type IN ( ${sqlString.escape(type)} )
			AND u.user_created = ${sqlString.escape(req.user.id)}
			${searchFilter}
		`

		let queryStringFind = `
			SELECT
				u.id,
				u.original_name,
				u.file_type,
				u.file_size,
				u.createdAt
			FROM 
				uploads as u
			${queryString}
			ORDER BY ${sortField}
			LIMIT ${pageSize} OFFSET ${skip}
		`

		let queryStringCount = `
			SELECT COUNT (*) as total
			FROM 
				uploads as u
			${queryString}	
		`

		PromiseBlueBird.all([Uploads.getDatastore().sendNativeQuery(queryStringFind), Uploads.getDatastore().sendNativeQuery(queryStringCount)])
			.spread((data, count) => {
				data.rows.forEach(e => {
					e.createdAt = `${moment(e.createdAt).format('MM/DD/YYYY')}`
					e.file_size = `${e.file_size}`
				})
				return res.json({
					items: data.rows,
					total: count.rows[0].total
				})
			})
			.catch(error => {
				console.log("Error ", error)
				return res.json({
					items: [],
					total: 0
				})
			})
	},

	deleteUploadFile: (req,res) => {
		let id = req.params.id

		Uploads.findOne(id)
			.then(result => {
				if (result) {
					return Uploads.update({id}, {is_deleted: 1}).fetch()
				}
				throw new Error('Error!')
			})
			.then(result => {
				return res.json({
					status: 'success',
                    message: 'Deleted file successfully!'
				})
			})
			.catch(error => {
				console.log(error)
                return res.json({ status: 'error' })
			})
	}

}