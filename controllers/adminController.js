const db = require('../models')
const Restaurant = db.Restaurant

const adminController = {
	getRestaurants: (req, res) => {
		return Restaurant.findAll().then(restaurants => {
			return res.render('admin/restaurants', {
				restaurants: restaurants,
				user: req.user,
				isAuthenticated: req.isAuthenticated
			})
		})
	},
	getRestaurant: (req, res) => {
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
		return Restaurant.create({
			name: req.body.name,
			tel: req.body.tel,
			address: req.body.address,
			opening_hours: req.opening_hours,
			description:req.body.description
		})
			.then((restaurant) => {
				req.flash('success_msg', 'restaurant was successfully created')
				res.redirect('/admin/restaurants')
			})
	},
	editRestaurant: (req, res) => {
		return Restaurant.findByPk(req.params.id).then(restaurant => {
			return res.render('admin/create', { restaurant: restaurant})
		})
	},
	putRestaurant: (req, res) => {
		if (!req.body.name) {
			req.flash('error_msg', "name didn't exist")
			return res.redirect('back')
		}
		return Restaurant.findByPk(req.params.id)
			.then((restaurant) => {
				restaurant.update({
					name: req.body.name,
					tel: req.body.tel,
					address: req.body.address,
					opening_hours: req.opening_hours,
					description: req.body.description
				})
					.then((restaurant) => {
						req.flash('success_msg', 'restaurant was successfully to update')
						res.redirect('/admin/restaurants')
					})
			})
	},
	deleteRestaurant: (req, res) => {
		return Restaurant.findByPk(req.params.id)
			.then((restaurant) => {
				restaurant.destroy()
					.then((restaurant) => {
						res.redirect('/admin/restaurants')
					})
			})
	}
}
module.exports = adminController
