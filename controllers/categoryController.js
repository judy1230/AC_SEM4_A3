const db = require('../models')
const Category = db.Category
const categoryService = require('./services/categoryService.js')

const categoryController = {
	getCategories: (req, res) => {
		categoryService.getCategories(req, res, (data) => {
			return res.render('admin/categories', data)
		})
		// return Category.findAll().then(categories => {
		// 	return res.render('admin/categories', {
		// 		categories: categories
		// 	})
		// })
	},
	postCategories: (req, res) => {
		categoryService.postCategories(req, res, (data) => {
			if (data['status'] === 'error') {
				req.flash('error_msg', data['message'])
			}
			req.flash('success_msg', data['message'])
			return res.render('/admin/categories')
		})
	
	},
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
	putCategory: (req, res) => {
		if (!req.body.name) {
			req.flash('error_messages', 'name didn\'t exist')
			return res.redirect('back')
		} else {
			return Category.findByPk(req.params.id)
				.then((category) => {
					category.update(req.body)
						.then((category) => {
							res.redirect('/admin/categories')
						})
				})
		}
	},
	deleteCategory: (req, res) => {
		return Category.findByPk(req.params.id)
			.then((category) => {
				category.destroy()
					.then((category) => {
						res.redirect('/admin/categories')
					})
			})
	}

}

module.exports = categoryController
