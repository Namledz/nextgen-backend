'use strict'

module.exports = function (req, res, next) {

	let user = req.user;
	if (user.role != Users.roles.ADMIN) {
        return res.json({ status: 'error', message: 'Not authorized!' })
	} else {
		return next();
	}
}