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

        Users.findOne({email: email})
            .then(result => {
                if (result) {
                    if ( password = result.password) {
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
    }
}