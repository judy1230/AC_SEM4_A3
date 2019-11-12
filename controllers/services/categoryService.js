const db = require('../../models')
const Category = db.Category

let categoryService = {
	getCategories: (req, res, callback) => {
		return Category.findAll().then(categories => {
			callback({
				categories: categories
			})
		})
	},
	postCategories: (req, res, callback) => {
		if (!req.body.name) {
			callback({ status: 'error', message: "name didn\'t exist"})
			//req.flash('error_msg', 'name didn\'t exist')
			//return res.redirect('back')
		} else {
			return Category.create({
				name: req.body.name
			})
				.then((category) => {
					callback({status: 'success', message: "Category has successfully created"})
				//	res.redirect('/admin/categories')
				})
		}
	},
}
module.exports = categoryService
