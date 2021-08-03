'use strict'

module.exports = function (req, res, next) {
	// let exceptionalUrl = ['/users/login', '/auth/register', '/auth/forgotPassword', '/auth/updatePassword'];
	// console.log(req.path)
	// if (exceptionalUrl.indexOf(req.path) !== -1) {
	// 	return next();
	// }
	// if (req.cookies && req.cookies.access_token) {
		
	// 	req.user = {
	// 		id: 1,
	// 		username: 'quoclinh',
	// 		first_name: 'quoc',
	// 		last_name: 'nguyen',
	// 		email: 'quoclinh@ymail.com',

	// 	}
	// 	return next();
	// } else {
	// 	return res.status(401).json({ status: 'error' })
	// }

	req.user = {
		id: 1,
		username: 'quoclinh',
		first_name: 'quoc',
		last_name: 'nguyen',
		email: 'quoclinh@ymail.com',

	}
	return next();
}