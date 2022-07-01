const router = require('express').Router();

// Route in categories 
const categoriesRoutes = require('./categories.routes');
router.use('/categories', categoriesRoutes);

// Route in products
const productsRoutes = require('./products.routes');
router.use('/Products', productsRoutes);

// Route in users
const usersRoutes = require('./users.routes');
router.use('/Users', usersRoutes);

module.exports = router;