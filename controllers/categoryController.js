const db = require('../models')
const Category = db.Category
const categoryService = require('./services/categoryService.js')

const categoryController = {
	// getCategories: (req, res) => {
	// 	categoryService.getCategories(req, res, (data) => {
	// 		return res.render('admin/categories', data)
	// 	})
	// 	// return Category.findAll().then(categories => {
	// 	// 	return res.render('admin/categories', {
	// 	// 		categories: categories
	// 	// 	})
	// 	// })
	// },
	getCategories: (req, res) => {
		return Category.findAll().then(categories => {
			if (req.params.id) {
				Category.findByPk(req.params.id)
					.then((category) => {
						return res.render('admin/categories', { categories: categories, category: category })
					})
			} else {
				return res.render('admin/categories', { categories: categories })
			}
		})
	},
	postCategories: (req, res) => {
		categoryService.postCategories(req, res, (data) => {
			if (data['status'] === 'error') {
				req.flash('error_msg', data['message'])
				return res.redirect('back')
			}
			req.flash('success_msg', data['message'])
			res.redirect('/admin/categories')
		})

	},

	putCategory: (req, res) => {
		categoryService.putCategory(req, res, (data) => {
			if (data['status'] === 'error') {
				req.flash('error_msg', data['message'])
				return res.redirect('back')
			}
			req.flash('success_msg', data['message'])
			res.redirect('/admin/categories')
		})
	},
	deleteCategory: (req, res) => {
		categoryService.deleteCategory(req, res, (data) => {
			if (data['status'] === 'success') {
				return res.redirect('/admin/categories')
			}
		})
	}

}

module.exports = categoryController
