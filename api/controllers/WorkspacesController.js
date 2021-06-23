/**
 * WorkspacesController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

const sqlString = require('sqlstring');
const moment = require('moment');

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
			searchFilter = `WHERE ( workspace.name LIKE ${sqlSearchTerm}
				OR workspace.last_modified LIKE ${sqlSearchTerm}
				OR workspace.number LIKE ${sqlSearchTerm}
                OR workspace.pipeline LIKE ${sqlSearchTerm} )`
		}

		let queryString = `
            SELECT
                workspace.id, 
                workspace.name, 
                workspace.last_modified as lastModified, 
                workspace.user_created_id as createdBy, 
                t.total as number,
				u.email as createdBy,
                workspace.pipeline	
            FROM
                workspace
			LEFT JOIN
				(SELECT COUNT(a.project_id) as total, a.project_id FROM analysis as a GROUP BY a.project_id) as t
			ON workspace.id = t.project_id
			LEFT JOIN users as u ON u.id = workspace.user_created_id
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
				});
				return res.json({ items: data.rows, total: allData.length })
			})
			.catch(error => {
                console.log(error);
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
	}

};

