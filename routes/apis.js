const express = require('express');
const router = express.Router();

const adminController = require('../controllers/api/adminController.js')

router.get('/api/admin/restaurants', adminController.getRestaurants)
//router.get('/api/admin/restaurants/:id', adminController.getRestaurant)


module.exports = router
