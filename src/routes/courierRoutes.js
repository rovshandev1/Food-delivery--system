const express = require('express');
const router = express.Router();
const courierController = require('../controllers/courierController');
const authenticationMiddleware = require('../middleware/authentication');
const authorizationMiddleware = require('../middleware/authorization');

// Add a new courier
router.post('/', authenticationMiddleware.authenticateUser, authorizationMiddleware.isAdmin, courierController.addCourier);

// Get all couriers
router.get('/', authenticationMiddleware.authenticateUser, authorizationMiddleware.isAdmin, courierController.getCouriers);

// Assign a courier to an order
router.put('/:orderId/assign/:courierId', authenticationMiddleware.authenticateUser, authorizationMiddleware.isAdmin, courierController.assignCourier);

// Mark an order as delivered
router.put('/:orderId/delivered', authenticationMiddleware.authenticateUser, courierController.markDelivered);

// Delete a courier
router.delete("/:courierId", courierController.deleteCourier);

// Rate a courier
router.post('/rate-courier/:courierId', authenticationMiddleware.authenticateUser, courierController.rateCourier);

module.exports = router;
