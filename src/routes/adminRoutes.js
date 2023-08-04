const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const authenticationMiddleware = require('../middleware/authentication');
const authorizationMiddleware = require('../middleware/authorization');

router.get('/restaurant-requests', authenticationMiddleware.authenticateUser, authorizationMiddleware.isAdmin, adminController.manageRestaurantRequests);
router.get('/daily-order-count', authenticationMiddleware.authenticateUser, authorizationMiddleware.isAdmin, adminController.getDailyOrderCount);

module.exports = router;
