const db = require('../../models')
const Restaurant = db.Restaurant
const restService = require('../services/restService.js')

const restController = {
	getResDashboard: (req, res) => {
		restService.getResDashboard(req, res, (data) => {
			return res.json(data)
		})
	},
}

module.exports = restController
