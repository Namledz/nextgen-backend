
const PromiseBlueBird = require('bluebird');
const moment = require('moment');
const sqlString = require('sqlstring');

module.exports = {
    getSignedAuth: (req, res) => {
        let uploadName = req.body.uploadName;
        let fileType = req.body.fileType;
        let index = req.body.index;
        let user = req.user;

		let designation = `${sails.config.userFolder}/${user.id}/uploads/${uploadName}`;
        s3Service.getSignedUrl(designation, fileType)
            .then(result => {
                return res.json({ status: 'success', preSignedUrl: result, index: index });
            }).catch(error => {
                console.log("Error@UploadController-getSignedAuth: ", error);
                return res.json({ error: 'error' });
            })
	},

    uploadFileInfor: (req, res) => {
        let postFileInfor = req.body;
        let user = req.user;

        postFileInfor.user_created = user.id;
        postFileInfor.file_path = `${sails.config.userFolder}/${user.id}/uploads/${postFileInfor.upload_name}`;
        postFileInfor.is_deleted = 0;

		console.log(postFileInfor);

        return Uploads.create(postFileInfor).fetch()
            .then(data => {
                if(data) {
					return SampleService.createSample(data)
                }
                else {
                    throw ResponseService.customError('Error!');
                }
            })
			.then(sample => {
				return res.json({
					status: 'success',
					message: 'Uploaded files successfully!'
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
                    return res.json({ status: 'error' })
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
		let workspace = filter.workspace ? filter.workspace : []


		switch (column) {
			case 'name':
				sortField = `u.sample_name ${direction}`
				break;
            case 'workspace':
                sortField = `w.name ${direction}`
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
			searchFilter = ` AND ( u.sample_name LIKE ${sqlSearchTerm}
				OR u.file_type LIKE ${sqlSearchTerm}
				OR w.name LIKE ${sqlSearchTerm}
				)`
		}

		let queryString = `
			LEFT JOIN workspace as w
			ON u.workspace = w.id
			WHERE
				u.is_deleted = 0
			AND u.file_type IN ( ${sqlString.escape(type)} )
			${workspace.length > 0 ? `AND w.id IN ( ${sqlString.escape(workspace)} )`: ``} 
			AND u.user_created = ${sqlString.escape(req.user.id)}
			${searchFilter}
		`

		let queryStringFind = `
			SELECT
				u.id,
				u.sample_name,
				w.name as workspace_name,
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
	},

	getListWorkspace: (req,res) => {
		let queryString = `
			SELECT DISTINCT
				w.id,
				w.name
			FROM 
				workspace as w
			LEFT JOIN uploads as u
			ON w.id = u.workspace
			WHERE 
				u.is_deleted = 0
			AND u.user_created = ${sqlString.escape(req.user.id)}
			ORDER BY 
				w.id ASC	
		`

		Workspaces.getDatastore().sendNativeQuery(queryString)
			.then(result => {
				let data = result.rows
				return res.json(data)
			})
			.catch(error => {
				return res.json(error)
			})
	}

}