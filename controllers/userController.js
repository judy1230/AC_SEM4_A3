const bcrypt = require('bcrypt-nodejs')
const db = require('../models')
const User = db.User

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
		//res.redirect('/restaurants')
		res.redirect('/')
	},
	logout: (req, res) => {
		req.flash('success_msg', '成功登出!')
		req.logout()
		res.redirect('/signin')
	},
	getUser: (req, res) => {
		return User.findByPk(req.params.id)
			.then(user => {
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
		console.log(req.body)
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
	// putUser: (req, res) => {
	// 	if (!req.body.name) {
	// 		req.flash('error_msg', "name didn't exist")
	// 		return res.redirect('back')
	// 	}
	// 	const { file } = req
	// 	if (file) {
	// 		imgur.setClientID(IMGUR_CLIENT_ID);
	// 		imgur.upload(file.path, (err, img) => {
	// 			return User.findByPk(req.params.id)
	// 				.then((user) => {
	// 					user.update({
	// 						name: req.body.name,
	// 						email: req.body.email,
	// 						image: file ? img.data.link : user.image,
	// 					})
	// 						.then((user) => {
	// 							console.log('user', user)
	// 							req.flash('success_messages', 'user was successfully to update')
	// 							res.redirect(`/users/${user.id}`)
	// 						})
	// 				})
	// 		})
	// 	} else {
	// 		return User.findByPk(req.params.id)
	// 			.then((user) => {
	// 				user.update({
	// 					name: req.body.name,
	// 					email:req.body.email,
	// 					image: restaurant.image
	// 				})
	// 					.then((user) => {
	// 						req.flash('success_msg', 'user was successfully to update')
	// 						res.redirect(`/users/${user.id}`)
	// 					})
	// 			})
	// 	}

	// },

}
module.exports = userController
