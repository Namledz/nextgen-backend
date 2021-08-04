'use strict'

module.exports = function (req, res, next) {
	let exceptionalUrl = ['/users/login', '/auth/register', '/auth/forgotPassword', '/auth/updatePassword'];
	if (exceptionalUrl.indexOf(req.path) !== -1) {
		return next();
	}
	if (req.cookies && req.cookies.access_token) {
		return Users.findOne({id})
			.then(user => {
				req.user = {
					id: user.id,
					first_name: user.first_name,
					last_name: user.last_name,
					email: user.email,
					role: user.role
		
				}
				return next();
			})
	} else {
		return res.status(401).json({ status: 'error' })
	}

}