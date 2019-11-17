const db = require('../../models')
const Restaurant = db.Restaurant
const Category = db.Category
const User = db.User
const Comment = db.Comment
let restService = {
	getResDashboard: (req, res, callback) => {
		return Restaurant.findByPk(req.params.id, {
			include: [
				Category,
				{ model: User, as: 'FavoritedUsers' },
				{ model: Comment, include: [Restaurant] },
			]
		}).then(restaurant => {
			callback({ restaurant: restaurant})
		})
	}

}
module.exports = restService
