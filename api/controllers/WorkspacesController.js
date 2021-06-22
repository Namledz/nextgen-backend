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
                workspace.number, 
                workspace.pipeline
            FROM
                workspace
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
					e.createdBy = 1 ? "qnguyen@ymal.com" : "Unknown"
				});
				return res.json({ items: data.rows, total: allData.length })
			})
			.catch(error => {
                console.log(error);
				return res.json({ status: 'error' })
			})
    }

};

