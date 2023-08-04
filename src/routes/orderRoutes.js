const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');
const authenticationMiddleware = require('../middleware/authentication');

router.post('/', authenticationMiddleware.authenticateUser, orderController.placeOrder);

router.post('/checkout', authenticationMiddleware.authenticateUser, orderController.checkout);

router.get('/user/:userId', authenticationMiddleware.authenticateUser, orderController.getUserOrders);

router.delete('/:orderId', authenticationMiddleware.authenticateUser, orderController.deleteOrder);

router.post('/rate', authenticationMiddleware.authenticateUser, orderController.rateOrder);

module.exports = router;
