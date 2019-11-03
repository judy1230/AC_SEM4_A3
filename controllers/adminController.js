const db = require('../models')
const Restaurant = db.Restaurant
const User = db.User
const imgur = require('imgur-node-api')
const IMGUR_CLIENT_ID = '158d5ec5eff6842'
const fs = require('fs')

const adminController = {
	getRestaurants: (req, res) => {
		return Restaurant.findAll({
			order: [
				['id', 'ASC'],
			],}).then(restaurants => {
			return res.render('admin/restaurants', {
				restaurants: restaurants,
				user: req.user,
				isAuthenticated: req.isAuthenticated
			})
		})
	},
	getRestaurant: (req, res) => {
		console.log('res req.params.id', req.params.id)
		return Restaurant.findByPk(req.params.id).then(restaurant => {
			return res.render('admin/restaurant', {
				restaurant: restaurant
			})
		})
	},
	createRestaurant: (req, res) => {
		return res.render('admin/create')
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
				}).then((restaurant) => {
					req.flash('success_messages', 'restaurant was successfully created')
					return res.redirect('/admin/restaurants')
				})
			})
			// fs.readFile(file.path, (err, data) => {
			// 	if (err) console.log('Error', err)
			// 	fs.writeFile(`upload/${file.originalname}`, data, () => {
			// 		return Restaurant.create({
			// 				name: req.body.name,
			// 				tel: req.body.tel,
			// 				address: req.body.address,
			// 				opening_hours: req.opening_hours,
			// 				description: req.body.description,
			// 				image: file ? `/upload/${file.originalname}` : null
			// 			})
			// 			.then((restaurant) => {
			// 				req.flash('success_msg', 'restaurant was successfully created')
			// 				res.redirect('/admin/restaurants')
			// 			})
			// 	})
			// })
		} else {
			return Restaurant.create({
					name: req.body.name,
					tel: req.body.tel,
					address: req.body.address,
					opening_hours: req.opening_hours,
					description: req.body.description,
					image: null
				})
				.then((restaurant) => {
					req.flash('success_msg', 'restaurant was successfully created')
					res.redirect('/admin/restaurants')
				})
		}

	},
	editRestaurant: (req, res) => {
		return Restaurant.findByPk(req.params.id).then(restaurant => {
			return res.render('admin/create', {
				restaurant: restaurant
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
						})
							.then((restaurant) => {
								req.flash('success_messages', 'restaurant was successfully to update')
								res.redirect('/admin/restaurants')
							})
					})
			})
			// fs.readFile(file.path, (err, data) => {
			// 	if (err) console.log('Error', err)
			// 	fs.writeFile(`upload/${file.originalname}`, data, () => {
			// 		return Restaurant.findByPk(req.params.id)
			// 			.then((restaurant) => {
			// 				restaurant.update({
			// 						name: req.body.name,
			// 						tel: req.body.tel,
			// 						address: req.body.address,
			// 						opening_hours: req.opening_hours,
			// 						description: req.body.description,
			// 						image: file ? `/upload/${file.originalname}` : restaurant.image
			// 					})
			// 					.then((restaurant) => {
			// 						req.flash('success_msg', 'restaurant was successfully to update')
			// 						res.redirect('/admin/restaurants')
			// 					})
			// 			})
			// 	})
			// })
		} else {
			return Restaurant.findByPk(req.params.id)
				.then((restaurant) => {
					restaurant.update({
							name: req.body.name,
							tel: req.body.tel,
							address: req.body.address,
							opening_hours: req.opening_hours,
							description: req.body.description,
							image: restaurant.image
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
			return res.render('admin/users', {
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
	    user.isAdmin ? Role='Admin' : Role='User'
			req.flash('success_msg', `${user.name} is successfully set as ${Role}`)
			return res.redirect('/admin/users')
		})
	}

}
module.exports = adminController
