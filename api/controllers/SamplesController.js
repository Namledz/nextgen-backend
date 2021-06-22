'use strict'
/**
 * SamplesController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */
const PromiseBlueBird = require('bluebird');
const sqlString = require('sqlstring');
const moment = require('moment');
module.exports = {
    list: (req,res) => {

        let queryStringFind = `
            SELECT
                s.id,
                s.name,
                s.data_type,
                s.control,
                s.genotype,
                s.createdAt,
                s.updatedAt,
                u.email,
                u.role
            FROM 
                samples as s
            LEFT JOIN users as u
            ON s.user_id = u.id
        `

        let queryStringCount = `
            SELECT COUNT (*) as total 
            FROM
                samples as s
            LEFT JOIN users as u
            ON s.user_id = u.id
        `

        PromiseBlueBird.all([Samples.getDatastore().sendNativeQuery(queryStringFind), Samples.getDatastore().sendNativeQuery(queryStringCount)])
            .spread((data, count) => {
                return res.json({
                    items: data.rows,
                    total: count.rows[0].total
                })
            })
    }
}