const express = require('express');
const router = express.Router();
const menuController = require('../controllers/menuController');
const authenticationMiddleware = require('../middleware/authentication');
const authorizationMiddleware = require('../middleware/authorization');

// Add new menu
router.post('/add', authenticationMiddleware.authenticateUser, authorizationMiddleware.isAdmin, menuController.addMenu);

// Get all menus
router.get('/', menuController.getAllMenus);

// Get menu by ID
router.get('/:menuId', menuController.getMenuById);

// Update menu by ID
router.patch('/:menuId', authenticationMiddleware.authenticateUser, authorizationMiddleware.isAdmin, menuController.updateMenu);

// Delete menu by ID
router.delete('/:menuId', authenticationMiddleware.authenticateUser, authorizationMiddleware.isAdmin, menuController.deleteMenu);

// Search menus by name
router.get('/search', authenticationMiddleware.authenticateUser, menuController.searchMenus);


module.exports = router;
