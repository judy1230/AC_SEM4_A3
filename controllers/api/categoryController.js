const db = require('../../models')
const Category = db.Category
const categoryService = require('../services/categoryService.js')

const categoryController = {
	getCategories: (req, res) => {
		categoryService.getCategories(req, res, (data) => {
			return res.json(data)
		})
		// 	return Category.findAll().then(categories => {
		// 		return res.render('admin/categories', {
		// 			categories: categories
		// 		})
		// 	})
		// },
	}
}
module.exports = categoryController

