const bcrypt = require('bcrypt-nodejs')
const db = require('../models')
const User = db.User
const Comment = db.Comment
const Restaurant = db.Restaurant
const Favorite = db.Favorite
const Like = db.Like


let userController = {
	signUpPage: (req, res) => {
		return res.render('signup')
	},
	signUp: (req, res) => {
		//confirm password
		if (req.body.passwordCheck !== req.body.password) {
			req.flash('error_msg', '兩次密碼輸入不同!')
			return res.redirect('/signup')
		} else {
			//confirm unique user
			User.findOne({ where: { email: req.body.email } }).then(user => {
				if (user) {
					req.flash('error_msg', '信箱重複')
					return res.redirect('/signup')
				} else {
					User.create({
						name: req.body.name,
						email: req.body.email,
						password: bcrypt.hashSync(req.body.password,
							bcrypt.genSaltSync(10), null)
					}).then(user => {
						req.flash('success_msg', '成功註冊帳號!')
						return res.redirect('/signin')
					})
				}
			})
		}
	},
	signInPage: (req, res) => {
		return res.render('signin')
	},
	signIn: (req, res) => {
		req.flash('success_msg', '成功登入!')
		res.redirect('/')
	},
	logout: (req, res) => {
		req.flash('success_msg', '成功登出!')
		req.logout()
		res.redirect('/signin')
	},
	getUser: (req, res) => {
		User.findByPk(req.params.id, {
			include: [
				{model: Comment, include:[Restaurant]}
			]
		}).then(user => {
			return res.render('profile', {
				user: user
			})
		})
	},
	editUser: (req, res) => {
		return User.findByPk(req.params.id)
			.then(user => {
				return res.render('editProfile', {
					user: user
				})
			})
	},
	putUser: (req, res) => {

		return User.findByPk(req.params.id).then(user =>{
			user.update({
				name: req.body.name,
				email: req.body.email,
				image: req.body.image
			})
				req.flash('success_msg', `${user.name} is successfully updated`)
				return res.redirect(`/users/${user.id}`)
		})
	},
	addFavorite: (req, res) => {
		return Favorite.create({
			UserId: req.user.id,
			RestaurantId: req.params.restaurantId
		})
			.then((restaurant) => {
				return res.redirect('back')
			})
	},
	removeFavorite: (req, res) => {
		return Favorite.findOne({
			where: {
				UserId: req.user.id,
				RestaurantId: req.params.restaurantId
		}})
			.then((favorite) => {
				favorite.destroy()
					.then((restaurant) => {
						return res.redirect('back')
					})
			})
	},
	addLike: (req, res) => {
		return Like.create({
			UserId: req.user.id,
			RestaurantId: req.params.restaurantId
		})
			.then((like) => {
				return res.redirect('back')
			})
	},
	removeLike: (req, res) => {
		return Like.findOne({
			where: {
				UserId: req.user.id,
				RestaurantId: req.params.restaurantId
			}
		}).then((like) => {
			like.destroy()
				.then((restaurant) => {
					return res.redirect('back')
				})
		})
	},
}
module.exports = userController
