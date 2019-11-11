const db = require('../../models')
const Restaurant = db.Restaurant
const Category = db.Category


const adminService = {
	getRestaurants: (req, res, callback) => {
		return Restaurant.findAll({
			order: [
				['id', 'ASC'],
			],
			include: [Category]
		}).then(restaurants => {
			callback({
				restaurants: restaurants,
				user: req.user,
				isAuthenticated: req.isAuthenticated
			})
		})
	},
	

}
module.exports = adminService