const db = require('../models')
const Restaurant = db.Restaurant
const User = db.User
const Category = db.Category
const imgur = require('imgur-node-api')
const IMGUR_CLIENT_ID = '158d5ec5eff6842'
const fs = require('fs')
const adminService = require('./services/adminService.js')

const adminController = {
	getRestaurants: (req, res) => {
		adminService.getRestaurants(req, res, (data) => {
			return res.render('admin/restaurants', data)
		})
	},
	getRestaurant: (req, res) => {
		adminService.getRestaurant(req, res, (data) => {
			return res.render('admin/restaurant', data)
		})
		// console.log('res req.params.id', req.params.id)
		// return Restaurant.findByPk(req.params.id, {include:[Category]}).then(restaurant => {
		// 	return res.render('admin/restaurant', {
		// 		restaurant: restaurant
		// 	})
		// })
	},
	createRestaurant: (req, res) => {
		Category.findAll().then(categories => {
			return res.render('admin/create', {
				categories: categories
			})
		})
	},
	postRestaurant: (req, res) => {
		if (!req.body.name) {
			req.flash('error_msg', "name didn't exit")
			return res.redirect('back')
		}

		const { file } = req
		if (file) {
			imgur.setClientID(IMGUR_CLIENT_ID)
			imgur.upload(file.path, (err, img) => {
				return Restaurant.create({
					name: req.body.name,
					tel: req.body.tel,
					address: req.body.address,
					opening_hours: req.body.opening_hours,
					description: req.body.description,
					image: file ? img.data.link : null,
					CategoryId: req.body.categoryId
				}).then((restaurant) => {
					req.flash('success_messages', 'restaurant was successfully created')
					return res.redirect('/admin/restaurants')
				})
			})

		} else {
			return Restaurant.create({
					name: req.body.name,
					tel: req.body.tel,
					address: req.body.address,
					opening_hours: req.opening_hours,
					description: req.body.description,
				  image: null,
				  CategoryId: req.body.categoryId
				})
				.then((restaurant) => {
					req.flash('success_msg', 'restaurant was successfully created')
					res.redirect('/admin/restaurants')
				})
		}

	},
	editRestaurant: (req, res) => {
		Category.findAll().then(categories => {
			return Restaurant.findByPk(req.params.id)
				.then(restaurant => {
				return res.render('admin/create', {
					categories: categories,
					restaurant: restaurant
				})
			})
		})
	},
	putRestaurant: (req, res) => {
		if (!req.body.name) {
			req.flash('error_msg', "name didn't exist")
			return res.redirect('back')
		}
		const {	file } = req
		if (file) {
			imgur.setClientID(IMGUR_CLIENT_ID);
			imgur.upload(file.path, (err, img) => {
				return Restaurant.findByPk(req.params.id)
					.then((restaurant) => {
						restaurant.update({
							name: req.body.name,
							tel: req.body.tel,
							address: req.body.address,
							opening_hours: req.body.opening_hours,
							description: req.body.description,
							image: file ? img.data.link : restaurant.image,
							CategoryId: req.body.categoryId
						})
							.then((restaurant) => {
								console.log('restaurant', restaurant)
								req.flash('success_messages', 'restaurant was successfully to update')
								res.redirect('/admin/restaurants')
							})
					})
			})
		} else {
			return Restaurant.findByPk(req.params.id)
				.then((restaurant) => {
					restaurant.update({
							name: req.body.name,
							tel: req.body.tel,
							address: req.body.address,
							opening_hours: req.opening_hours,
							description: req.body.description,
						image: restaurant.image,
						CategoryId: req.body.categoryId
						})
						.then((restaurant) => {
							req.flash('success_msg', 'restaurant was successfully to update')
							res.redirect('/admin/restaurants')
						})
				})
		}

	},
	deleteRestaurant: (req, res) => {
		return Restaurant.findByPk(req.params.id)
			.then((restaurant) => {
				restaurant.destroy()
					.then((restaurant) => {
						res.redirect('/admin/restaurants')
					})
			})
	},
	editUsers: (req, res) => {
		return User.findAll({
			//bug0-confusion sort after latest update
			order: [
				['id', 'ASC'],
			],
		})
			.then(users => {
			return res.render('profile', {
				users: users,
				setRole: false
			})

		})
	},
	putUsers: (req, res) => {
		return User.findByPk(req.params.id).then(user => {
			user.update({
				isAdmin: !user.isAdmin
			})
			user.isAdmin ? Role = 'Admin' : Role ='User'
			req.flash('success_msg', `${user.name} is successfully set as ${Role}`)
			return res.redirect('/admin/users')
		})
	}

}
module.exports = adminController
