const productsRoutes = require('express').Router();
const Products = require('../controllers/products.controller');

// show
productsRoutes.get("/all", Products.findAll)

// list
productsRoutes.get("/show/:id", Products.findOne)

// create
productsRoutes.post("/create", Products.create)

// update
productsRoutes.put("/update", Products.update)

// delete
productsRoutes.delete("/delete/:id", Products.delete)

module.exports = productsRoutes;