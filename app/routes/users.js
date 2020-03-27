//importing libraries
const express = require('express');

//middleware
const auth = require('../middleware/auth');

//importing controller
const userController = require('../controllers/userController');

const route = express.Router();

route.post('/signUp',userController.signUp);

route.post('/logOut',auth,userController.logOut);

route.post('/logIn',userController.logIn);

route.get('/allUsers',userController.getAllUsers);

module.exports = route;