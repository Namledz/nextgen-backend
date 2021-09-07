'use strict'
/**
 * FilterController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */
const PromiseBlueBird = require('bluebird');
const sqlString = require('sqlstring');
const moment = require('moment');

module.exports = {
    save: (req, res) => {
        const user = req.user;
        const { name, filter_string } = req.body.data

        return Filter.findOne({name, user_id: user.id})
        .then(filter => {
            if(filter) {
                return Filter.updateOne({id: filter.id}, { filter_string })
            }
            return Filter.create({
                name,
                filter_string,
                user_id: user.id
            }).fetch()
        })
        .then(result => {
            return res.json({ status: 'success', message: 'Save filter successfully!' });
        })
        .catch(error => {
            console.log("Error@FilterController-create: ", error);
            return res.json({ status: 'error', error });
        })
    },

    load: (req, res) => {
        const user = req.user
        const name = req.body.name

        return Filter.findOne({ name, user_id: user.id })
        .then(filter => {
            if(!filter) {
                throw ResponseService.customError('Can not found filter!');
            }

            return res.json({ status: 'success', filter })
        })
        .catch(error => {
            if (ResponseService.isCustomError(error)) {
                return res.json({
                    status: 'error',
                    message: error.message,
                    filter: null
                })
            }
            else {
                console.log(error);
                return res.json({ status: 'error', filter: null })
            }
        })
    },

    getFilters: (req, res) => {
        const user = req.user

        return Filter.find({user_id: user.id})
        .then(filters => {
            if(!filters) {
                throw ResponseService.customError('Can not found any filter!');
            }

            return res.json({ status: 'success', filters })
        })
        .catch(error => {
            if (ResponseService.isCustomError(error)) {
                return res.json({
                    status: 'error',
                    message: error.message,
                    filters: []
                })
            }
            else {
                console.log(error);
                return res.json({ status: 'error', filters: [] })
            }
        })
    }
}