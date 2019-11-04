const resController = require('../controllers/restController.js')
const adminController = require('../controllers/adminController.js')
const userController = require('../controllers/userController.js')
const categoryController = require('../controllers/categoryController.js')
const multer = require('multer')
const upload = multer({ dest: 'temp/' })


module.exports = (app, passport) => {
	const authenticated = (req, res, next) => {
		if (req.isAuthenticated()) {
			return next()
		}
		res.redirect('/signin')
	}
		const authenticatedAdmin = (req, res, next) => {
			if (req.isAuthenticated()) {
				if (req.user.isAdmin) {	return next()}
				return res.redirect('/')
			}
			res.redirect('/signin')
	}
	//get in login page
	app.get('/', authenticated, (req, res) => res.redirect('/restaurants'))
	app.get('/restaurants', authenticated, resController.getRestaurants)
	//get in admin
	app.get('/admin', authenticatedAdmin, (req, res) => res.redirect('/admin/restaurants'))
	//app.get('/admin/restaurants', authenticatedAdmin, adminController.getRestaurants)

	//admin config
	//categories
	app.get('/admin/categories', authenticatedAdmin, categoryController.getCategories)
	app.post('/admin/categories', authenticatedAdmin, categoryController.postCategories)
	app.get('/admin/categories/:id', authenticatedAdmin, categoryController.getCategories)
	app.put('/admin/categories/:id', authenticatedAdmin, categoryController.putCategory)

	//users
	app.get('/admin/users', authenticatedAdmin, adminController.editUsers)
	app.get('/admin/setUser/:id', authenticatedAdmin, adminController.putUsers)
	//restaurants
	app.get('/admin/restaurants', authenticatedAdmin, adminController.getRestaurants)
	app.get('/admin/restaurants/create', authenticatedAdmin, adminController.createRestaurant)
	app.post('/admin/restaurants', authenticatedAdmin, upload.single('image'), adminController.postRestaurant)
	app.get('/admin/restaurants/:id', authenticatedAdmin, adminController.getRestaurant)
	app.get('/admin/restaurants/:id/edit', authenticatedAdmin, adminController.editRestaurant)
	app.put('/admin/restaurants/:id', authenticatedAdmin, upload.single('image'), adminController.putRestaurant)
	app.delete('/admin/restaurants/:id', authenticatedAdmin, adminController.deleteRestaurant)
	//users sign up
	app.get('/signup', userController.signUpPage)
	app.post('/signup', userController.signUp)
	//users sing in
	app.get('/signin', userController.signInPage)
	app.post('/signin', passport.authenticate('local', {
		failureRedirect: '/signin',
		failureFlash: true
	}), userController.signIn)
	//users logout
	app.get('/logout', userController.logout)
}
