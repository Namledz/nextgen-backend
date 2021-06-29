/**
 * SarcovControllerController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */
 const sqlString = require('sqlstring');
 const moment = require('moment');


 module.exports = {
    getLineageDetail: (req, res) => {
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
			searchFilter = `WHERE ( sarscov.taxon LIKE ${sqlSearchTerm}
				OR sarscov.pangolin_lineage LIKE ${sqlSearchTerm}
				OR sarscov.uhser_lineage LIKE ${sqlSearchTerm}
                OR sarscov.conflict LIKE ${sqlSearchTerm}
                OR sarscov.ambiguity_score LIKE ${sqlSearchTerm}
                OR sarscov.scorpio_call LIKE ${sqlSearchTerm}
                OR sarscov.scorpio_support LIKE ${sqlSearchTerm}
                OR sarscov.scorpio_conflict LIKE ${sqlSearchTerm}
                OR sarscov.version LIKE ${sqlSearchTerm}
                OR sarscov.pangolin_version LIKE ${sqlSearchTerm}
                OR sarscov.pangoLEARN_version LIKE ${sqlSearchTerm}
                OR sarscov.pango_version LIKE ${sqlSearchTerm}
                OR sarscov.status LIKE ${sqlSearchTerm}
                OR sarscov.note LIKE ${sqlSearchTerm} )`
		}

		let queryString = `
            SELECT
                *	
            FROM
                sarscov
			${searchFilter}`

        let queryStringCount = queryString

		let queryStringFind = `
			${queryString}
			ORDER BY ${column} ${sortOrder}
			LIMIT ${pageSize} OFFSET ${skip}
		`

        Sarscov.getDatastore().sendNativeQuery(queryStringCount)
            .then((count) => {
                allData = count.rows;
                return Sarscov.getDatastore().sendNativeQuery(queryStringFind)
            })
			.then((data) => {
				return res.json({ items: data.rows, total: allData.length })
			})
			.catch(error => {
                console.log(error);
				return res.json({ status: 'error' })
			})        
    }

};

