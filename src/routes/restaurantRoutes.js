const express = require('express');
const router = express.Router();
const restaurantController = require('../controllers/restaurantController');
const authenticationMiddleware = require('../middleware/authentication');
const authorizationMiddleware = require('../middleware/authorization');

router.get('/', restaurantController.getRestaurants);
router.get('/nearby-restaurants', restaurantController.getNearbyRestaurants);
router.post('/', authenticationMiddleware.authenticateUser, authorizationMiddleware.isAdmin, restaurantController.addRestaurant);

module.exports = router;
