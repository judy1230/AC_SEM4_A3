const db = require('../../models')
const Category = db.Category

let categoryService = {
	getCategories: (req, res, callback) => {
		// categoryService.getCategories(req, res, (data) => {
		// 	return res.json(data)
		// })
		return Category.findAll().then(categories => {
			callback({
				categories: categories
			})
		})

	},
}
module.exports = categoryService
