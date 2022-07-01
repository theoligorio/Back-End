const categoriesRoutes = require('express').Router();
const Categories = require('../controllers/categories.controller');

// show
categoriesRoutes.get("/all", Categories.findAll)

// list
categoriesRoutes.get("/show/:id", Categories.findOne)

// create
categoriesRoutes.post("/create", Categories.create)

// update
categoriesRoutes.put("/update", Categories.update)

// delete
categoriesRoutes.delete("/delete/:id", Categories.delete)

module.exports = categoriesRoutes;