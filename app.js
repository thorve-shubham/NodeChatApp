//loading environment variables
require('dotenv').config()

//libraries
const config = require('config');

const express = require('express');
const mongoose = require('mongoose');
const body_parser = require('body-parser');

//middleware imports
const globalErrorHandler = require('./app/middleware/globalErrorHandler');

//routes import
const users = require('./app/routes/users'); 

const app = express();

//body parser middleware
app.use(express.json());
app.use(body_parser.urlencoded({extended : false}));

//routes
app.use('/api/v1/chat/users',users);

//express global error handler
app.use(globalErrorHandler);

mongoose.connect(config.get('db'),{useUnifiedTopology: true,useNewUrlParser:true,useCreateIndex:true})
    .then(console.log("Connected to db"))
    .catch((err)=>console.log("DB Connection failed",err));

app.listen(config.get('port'),()=>{
    console.log("listening on 3000");
    //console.log(config.get('key'));
    //console.log(process.env.jsonWebTokenKey);
})



