'use strict'
/**
 * UsersController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

module.exports = {
    login: (req,res) => {
        let email = req.body.email
        let password = req.body.password
		let data = 

        Users.findOne({email: email})
            .then(result => {
                if (result) {
                    if ( password == result.password) {
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
                }
                return res.json ({
                    status: "error",
                    message: "Your account does not exist !"
                })
            })
            .catch(error => {
                console.log(error)
                return res.json({status: "error"})
            })
    },

	getCurrentUser: (req, res) => {
		return res.json({ status: 'success', data: req.user });
	},
}