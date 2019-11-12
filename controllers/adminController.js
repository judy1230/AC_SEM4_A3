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
	},
	createRestaurant: (req, res) => {
		Category.findAll().then(categories => {
			return res.render('admin/create', {
				categories: categories
			})
		})
	},
	postRestaurant: (req, res) => {
		adminService.postRestaurant(req, res, (data) => {
			if (data['status'] === 'error') {
				req.flash('error_msg', data['message'])
				return res.redirect('back')
			}
			req.flash('success_msg', data['message'])
			res.redirect('/admin/restaurants')
		})

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
		adminService.putRestaurant(req, res, (data) => {
			if (data['status'] === 'error') {
				req.flash('error_msg', data['message'])
				return res.redirect('back')
			}
			req.flash('success_msg', data['message'])
			res.redirect('/admin/restaurants')
		})

	},
	deleteRestaurant: (req, res) => {
		adminService.deleteRestaurant(req, res, (data) => {
			if (data['status'] === 'success') {
				return res.redirect('/admin/restaurants')
			}

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
