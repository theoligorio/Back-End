const usersRoutes = require('express').Router();
const Users = require('../controllers/users.controller');

// show
usersRoutes.get("/all", Users.findAll)

// list
usersRoutes.get("/show/:id", Users.findOne)

// create
usersRoutes.post("/create", Users.create)

// update
usersRoutes.put("/update", Users.update)

// delete
usersRoutes.delete("/delete/:id", Users.delete)

// login
usersRoutes.get("/login", Users.findOne2);

// updatePassword
usersRoutes.put("/password", Users.update2);

module.exports = usersRoutes;