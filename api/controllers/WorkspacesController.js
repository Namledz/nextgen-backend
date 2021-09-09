/**
 * WorkspacesController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

const sqlString = require('sqlstring');
const moment = require('moment');
const PromiseBlueBird = require('bluebird');

module.exports = {
    listWorkspaces: (req, res) => {
		let searchTerm = req.body.searchTerm
		let filter = req.body.filter
		let grouping = req.body.grouping
		let sorting = req.body.sorting
		let column = sorting.column
		let sortOrder = sorting.direction
		let paginator = req.body.paginator
		let pageSize = paginator.pageSize ? paginator.pageSize : 10
		let page = paginator.page
		let skip = pageSize * (page - 1);
        let allData;
        let searchFilter = '';

		let sqlSearchTerm = sqlString.escape('%' + searchTerm + '%')

		if (searchTerm != '') {
			searchFilter = `AND ( workspace.name LIKE ${sqlSearchTerm}
				OR workspace.last_modified LIKE ${sqlSearchTerm}
				OR workspace.number LIKE ${sqlSearchTerm}
                OR p.name LIKE ${sqlSearchTerm} )`
		}

		let queryString = `
            SELECT
                workspace.id, 
                workspace.name, 
                workspace.last_modified as lastModified, 
                (SELECT SUM(variants) FROM analysis WHERE project_id = workspace.id) as number,
				u.email as createdBy,
				u.role,
                CONCAT (p.name , ' ', p.version) as pipeline	
            FROM
                workspace
			LEFT JOIN
				(SELECT COUNT(a.project_id) as total, a.project_id FROM analysis as a GROUP BY a.project_id) as t
			ON workspace.id = t.project_id
			LEFT JOIN users as u ON u.id = workspace.user_created_id
			LEFT JOIN pipeline as p ON p.id = workspace.pipeline
			WHERE workspace.is_deleted = 0
			${searchFilter}`

        let queryStringCount = queryString

		let queryStringFind = `
			${queryString}
			ORDER BY ${column} ${sortOrder}
			LIMIT ${pageSize} OFFSET ${skip}
		`

        Workspaces.getDatastore().sendNativeQuery(queryStringCount)
            .then((count) => {
                allData = count.rows;
                return Workspaces.getDatastore().sendNativeQuery(queryStringFind)
            })
			.then((data) => {
                data.rows.forEach(e => {
                    e.lastModified = e.lastModified ? `${moment(e.lastModified).format('MM/DD/YYYY')}` :  '';
					e.access = e.role == 1 ? 'Owner' : 'Reader',
					e.number = e.number ? e.number : 0
				});
				return res.json({ items: data.rows, total: allData.length })
			})
			.catch(error => {
				console.log('Error-WorkspacesController@listWorkspaces:', error);
				return res.json({ status: 'error' })
			})
    },

	getProjectName: (req, res) => {
		let id = req.params.id;
		Workspaces.findOne({ id: id }).then(w => {
			return res.json({ status: 'success', data: w.name })
		})
		.catch(error => {
			console.log(error);
			return res.json({ status: 'error' })
		})
	},

	getWorkspaceDashboard: (req,res) => {
		let id = req.params.id
		Workspaces.findOne({id: id})
			.then(result => {
				return res.json({
					status: 'success',
					data: result.dashboard
				})
			})
			.catch(error => {
				return res.json({status: 'error'})
			})
	},

	getListPipeline: (req,res) => {
		let data = []
		Pipelines.find()
			.then(result => {
				result.forEach(e => {
					let detail = {
						pipeline: `${e.name + ' ' + e.version}`,
						id: e.id 
					} 
					data.push(detail)
				})
				return res.json({data})
			})
			.catch(error => {
				console.log(error)
				return res.json({status: 'error'})
			})
	},

	updateWorkspaceDashboard: (req,res) => {
		let data = req.body.data
		let id = data.id
		let dashboardInfo = data.dashboardInfo

		Workspaces.update({id:id}, {dashboard: dashboardInfo}).fetch()
			.then(result => {
				if (result) {
					return res.json({
						status: 'success',
						message: 'Updated Successfully !'
					})
				}
			})
			.catch(error => {
				console.log(error)
				return res.json({status: 'error'})
			})
	},

	createWorkspace: (req,res) => {
		let data = {
			name: req.body.name,
			user_created_id: req.user.id,
			pipeline: req.body.pipeline,
			dashboard: req.body.dashboard,
			number: 0,
			last_modified: moment(Date.now()).format('YYYY-MM-DD hh:mm:ss')
		}

		Workspaces.findOne({ name: req.body.name})
			.then(result => {
				if (result) {
					let err = new Error('Your workspace name is already existed!');
                    err.isCustomError = true;
                    throw err
				}
				return Workspaces.create(data).fetch()
			})
			.then(data => {
				return res.json({
					status: 'success',
					message: 'Created workspace successfully !'
				})
			})
			.catch(error => {
				if(error.isCustomError) {
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

	search: (req,res) => {
		let userId = req.user.id
		let searchTerm = req.body.data
		let sqlSearchTerm = sqlString.escape('%' + searchTerm + '%')		

		let numberAnalysis = Analysis.count({
			user_id: userId,
			name: { 'like': '%' + searchTerm + '%' },
		})

		let numberAnalyses = AnalysesList.count({
			user_id: userId,
			name: { 'like': '%' + searchTerm + '%' },
		})

		let queryStringFindAnalysis = `
			SELECT
				a.id,
				a.name as analysis_name,
				w.name as workspace_name,
				a.status
			FROM analysis as a
			LEFT JOIN workspace as w
			ON a.project_id = w.id
			WHERE
				a.user_id = ${userId}
			AND
				a.name LIKE ${sqlSearchTerm}
		`	

		let queryStringFindAnalyses = `
			SELECT
				a.id,
				a.name as analyses_name,
				w.name as workspace_name,
				a.status
			FROM analyses_list as a
			LEFT JOIN workspace as w
			ON a.project_id = w.id
			WHERE
				a.user_id = ${userId}
			AND
				a.name LIKE ${sqlSearchTerm}
		`	


		PromiseBlueBird.all([
			numberAnalysis,
			numberAnalyses,
			Analysis.getDatastore().sendNativeQuery(queryStringFindAnalysis),
			AnalysesList.getDatastore().sendNativeQuery(queryStringFindAnalyses)
		])
			.spread((countAnalysis, countAnalyses, analysis, analyses) => {
				let data = []

				analysis.rows.forEach(e => {
					e.status = e.status == 2 ? 'Analyzed' : '' 
					data.push({
						type: 'analysis',
						data: e
					})
				})

				analyses.rows.forEach(e => {
					e.status = e.status == 2 ? 'Analyzed' : '' 
					data.push({
						type: 'analyses',
						data: e
					})
				})

				return res.json({
					totalAll: countAnalyses + countAnalysis,
					total: {
						countAnalyses: countAnalyses,
						countAnalysis: countAnalysis
					},
					data: data
				})
			})
			.catch(error => {
				console.log(error)
				return res.json({status: 'error'})
			})
	},

	deleteWorkspace: (req,res) => {
		let id = req.params.id

		return Workspaces.update({id}, {is_deleted: 1})
			.then(result => {
				return res.json({
					status: 'success',
					message: 'Deleted successfully!'
				})
			})
			.catch(error => {
				console.log(error)
				return res.json({ status: 'error' })
			})
	}
};

