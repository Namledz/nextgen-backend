'use strict'

module.exports = function (req, res, next) {
	let id = `${req.user.id}`;
	let workspaceID = req.params.id

	Workspaces.findOne({id: workspaceID})
		.then(result => {
			let array = result.access_user_ids.split(',')
			if ( array.indexOf(id) == -1 ) {
				return res.json({ status: 'error', message: 'Not authorized!' })
			} else {
				return next()
			}
		})

}