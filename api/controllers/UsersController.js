'use strict'
/**
 * UsersController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

const bcrypt = require('bcrypt');
const Promise = require('bluebird');
const sqlString = require('sqlstring');
const moment = require('moment');
const nodemailer = require('nodemailer');
const transporter = nodemailer.createTransport(sails.config.SMTP_HOST);
const escape = require('html-escape');

module.exports = {
    login: (req,res) => {
        let email = req.body.email
        let password = req.body.password

        Users.findOne({email: email})
            .then(result => {
                if (result) {
                    return bcrypt.compare(escape(password), loginResult.password)
                }
                else {
                    let err = new Error('Your account is not registered!');
                    err.isCustomError = true;
                    throw err
                }
            })
            .then(isPasswordMatched => {
                if(isPasswordMatched) {
                    res.cookie('access_token', 'loggedin', sails.config.COOKIES_CONFIG);
                    return res.json({
                        status: "success",
                        message: "Logged in successfully !",
                        data: result
                    })
                }
                return res.json ({
                    status: "error",
                    message: "Your password is incorrect"
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

	getCurrentUser: (req, res) => {
		return res.json({ status: 'success', data: req.user });
	},

	logout: (req, res) => {
		res.clearCookie('access_token', sails.config.COOKIES_CONFIG);
		return res.json({status: 'success', message: '"Logged out successfully!"'});
	},

    getUsers: function (req, res) {
		let searchTerm = req.body.searchTerm
		let filter = req.body.filter

		let sorting = req.body.sorting
        let column = sorting.column
        let direction = sorting.direction
		let paginator = req.body.paginator
		let pageSize = paginator.pageSize ? paginator.pageSize : 10
		let page = paginator.page
		let skip = pageSize * (page - 1);
		let allData;
		let role = []
		let status = []
		let searchFilter = ''
		let sortField = ''

		if (!filter.role) {
			role = Users.roles.LIST;
		} else {
			role = [filter.role]
		}

		if (!filter.status) {
			status = Users.statuses.LIST
		} else {
			status = [filter.status]
		}

        switch (column) {
			case 'name':
				sortField = `CONCAT(users.first_name, ' ', users.last_name) ${direction}`
				break;
            case 'email':
                sortField = `users.email ${direction}`
                break;
            case 'institution':
                sortField = `users.institution ${direction}`
                break;
            case 'group':
                sortField = `users.group ${direction}`
                break;
            case 'status':
                sortField = `users.status ${direction}`
                break;
            case 'role':
                sortField = `users.role ${direction}`
                break;
			default:
				sortField = `users.${column} ${direction}`
		}

		let sqlSearchTerm = sqlString.escape('%' + searchTerm + '%')

		if (searchTerm != '') {
			searchFilter = ` AND ( users.first_name LIKE ${sqlSearchTerm}
				OR users.last_name LIKE ${sqlSearchTerm}
				OR users.email LIKE ${sqlSearchTerm}
				OR CONCAT(users.first_name, ' ', users.last_name) LIKE ${sqlSearchTerm}
                OR users.institution LIKE ${sqlSearchTerm}
                OR users.group LIKE ${sqlSearchTerm} )`
		}

		let queryString = `
            SELECT
                users.id,
                users.email,
                CONCAT(users.first_name, ' ', users.last_name) as name,
                users.role,
                users.status,
                users.institution,
                users.group
            FROM
                users
			WHERE
			users.role IN ( ${sqlString.escape(role)} )
			AND users.status IN ( ${sqlString.escape(status)} )
			${searchFilter}
			AND users.id !=  ${sqlString.escape(req.user.id)}`

		let queryStringCount = queryString

		let queryStringFind = `
			${queryString}
			ORDER BY ${sortField}
			LIMIT ${pageSize} OFFSET ${skip}
		`

		Users.getDatastore().sendNativeQuery(queryStringCount)
			.then((count) => {
				allData = count.rows;
				return Users.getDatastore().sendNativeQuery(queryStringFind)
			})
			.then((select) => {
				select.rows.forEach(e => {
					e.status = Users.getUserStatus(e.status);
                    e.role = Users.getUserRole(e.role);
				});
				return res.json({
					items: select.rows,
					total: allData.length
				});
			})
			.catch(error => {
                console.log(error);
				return res.json({ status: 'error' })
			})

	},

    createUser: (req, res) => {
		let userCreated = {
            email: req.body.email,
			first_name: req.body.first_name,
			last_name: req.body.last_name,
            role: req.body.role ?  Users.getUserRoleNumber(req.body.role) : Users.roles.USER,
            status: req.body.status ? Users.getUserStatusNumber(req.body.status) : Users.statuses.PENDING,
			user_created: req.user.id,
			institution: req.body.institution ? req.body.institution : null,
			group: req.body.group ? req.body.group : null
		}

        Users.findOne({ email: req.body.email })
            .then((mail) => {
                if(mail) {
                    let err = new Error('Your email has already exists!');
                    err.isCustomError = true;
                    throw err
                }
                else if(req.body.first_name && req.body.last_name && req.body.email) {
                    return Users.create(userCreated).fetch()
                }
                else {
                    let err = new Error('You must fill all required fields!');
                    err.isCustomError = true;
                    throw err
                }
            })
            .then(user => {
                if (user) {
                    let url = `${sails.config.front_end.host}/setPassword/:${user.id}`;
                    let mailOptions = {
                        from: sails.config.SMTP_HOST.from,
                        to: user.email,
                        subject: 'Notification',
                        html: `Hi there,<br>
                            Click the link below to set your password:
                            <br>${url}<br>
                            Thanks,<br>
                            Mycovscan`
                    };
                    return transporter.sendMail(mailOptions);
                }
                else {
                    let err = new Error('Error!');
                    err.isCustomError = true;
                    throw err
                }
            })
            .then(data => {
                return res.json({
                    status: 'success',
                    message: 'Created user successfully!'
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

    findUserById: (req, res) => {
		let id = req.params.id;

        return Users.findOne({ id: id })
            .then(result => {
                result.status = Users.getUserStatus(result.status);
                result.role = Users.getUserRole(result.role);
                result.password = null;
                return res.send(result)
            })
            .catch(error => {
                console.log(error);
                return res.json({ status: 'error' })
			})

	},

    updateUser: (req, res) => {
        let id = req.body.id
        let userUpdated = {
            email: req.body.email,
			first_name: req.body.first_name,
			last_name: req.body.last_name,
			role: req.body.role ?  Users.getUserRoleNumber(req.body.role) : null,
            status: req.body.status ? Users.getUserStatusNumber(req.body.status) : null,
			institution: req.body.institution ? req.body.institution : null,
			group: req.body.group ? req.body.group : null
		}

        if(req.body.password) {
            userUpdated.password = bcrypt.hashSync(req.body.password, 10)
        }

        let userStatus;

        Users.findOne({id})
            .then(userMatch => {
                userStatus = userMatch.status;
                return Users.findOne({ and: [{email: req.body.email}, { email: { '!=': userMatch.email }}] })
            })
            .then(userFound => {
                if(userFound) {
                    let err = new Error('Email already existed!');
                    err.isCustomError = true;
                    throw err
                }
                else if(req.body.first_name && req.body.last_name && req.body.email) {
                    let promises = [];
                    if(userStatus == Users.statuses.PENDING && Users.getUserStatusNumber(req.body.status) == Users.statuses.ACTIVE) {
                        let url = `${sails.config.front_end.host}/auth/login`;
                        let mailOptions = {
                            from: sails.config.SMTP_HOST.from,
                            to: req.body.email,
                            subject: 'Welcome',
                            html: `Hi there,<br>
                                Your account was created. Please click the following link to login:
                                <br>${url}<br>
                                Thanks,<br>
                                Mycovscan`
                        };
                        promises.push(transporter.sendMail(mailOptions));
                    }
                    promises.push(Users.update({id: id}, userUpdated).fetch())

                    return Promise.all(promises)
                }
                else {
                    let err = new Error('You must fill all required fields!');
                    err.isCustomError = true;
                    throw err
                }
            })
            .then(data => {
                return res.json({
                    status: 'success',
                    message: 'Updated user successfully!'
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

    deleteUser: (req, res) => {
        let id = req.params.id;

        return Users.update({id}, {status: Users.statuses.DELETED})
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
    },

    setPasswordUser: (req, res) => {
		let id = req.body.id;
		let password = req.body.password;

        Users.findOne({id})
            .then(userFound => {
                if(userFound) {
                    let hashedPassword = bcrypt.hashSync(password, 10);
                    return Users.update({ id: id }, { password: hashedPassword }).fetch();
                }
                throw new Error('Error!')

            })
            .then(result => {
                return res.json({
                    status: 'success',
                    message: 'Your password has been set successfully. Admin will activate your account soon!'
                }) 
			})
			.catch(error => {
                console.log(error)
                return res.json({ status: 'error' })
			})  
	},
}