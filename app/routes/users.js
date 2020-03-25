//importing libraries
const express = require('express');

//importing controller
const userController = require('../controllers/userController');

const route = express.Router();

route.post('/signUp',userController.signUp);

route.post('/logOut',userController.logOut);

route.post('/logIn',userController.logIn);

module.exports = route;