const bcrypt = require('bcrypt-nodejs')
const db = require('../../models')
const User = db.User

//JWT
const jwt = require('jsonwebtoken')
const passportJWT = require('passport-jwt')
const ExtractJwt = passportJWT.ExtractJwt
const JwtStrategy = passportJWT.Strategy


let userController = {
	signIn: (req, res) => {
		//檢查必要資料
		if (!req.body.email || !req.body.password) {
			return res.json({
				status: ' error ', message: "required fields didn't exist"
			})
		}
		//檢查user是否存在與密碼是否正確
		let username = req.body.email
		let password = req.body.password

		User.findOne({ where: { email: username } }).then(user => {
			if (!user) return res.status(401).json({
				status: 'error',
				message: "no such user found"
			})
			if (!bcrypt.compareSync(password, user.password)) {
				return res.status(401).json({status: 'error', message: "password didn't match"})
			}
			//簽發token
			let payload = { id: user.id }
			let token = jwt.sign(payload, process.env.JWT_SECRET)
			return res.json({
				status: 'success',
				message: 'ok',
				token: token,
				user: {
					id: user.id, name:user.name, email:user.email, isAdmin:user.isAdmin
				}
			})
		})
	},
	signUp: (req, res) => {
		if (req.body.passwordCheck !== req.body.password) {
			return res.json({ status: 'error', message: '兩次密碼輸入不同！' })
		} else {
			User.findOne({ where: { email: req.body.email } }).then(user => {
				if (user) {
					return res.json({ status: 'error', message: '信箱重複！' })
				} else {
					User.create({
						name: req.body.name,
						email: req.body.email,
						password: bcrypt.hashSync(req.body.password, bcrypt.genSaltSync(10), null)
					}).then(user => {
						return res.json({ status: 'success', message: '成功註冊帳號！' })
					})
				}
			})
		}
	},
}

module.exports = userController
