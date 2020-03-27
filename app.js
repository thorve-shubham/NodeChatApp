//loading environment variables
require('dotenv').config()

//libraries
const config = require('config');
const socketLib = require('./app/libs/socketLib');
const express = require('express');
const mongoose = require('mongoose');
const body_parser = require('body-parser');
const http = require('http');

//middleware imports
const globalErrorHandler = require('./app/middleware/globalErrorHandler');

//routes import
const users = require('./app/routes/users'); 

const app = express();

//body parser middleware
app.use(express.json());
app.use(body_parser.urlencoded({extended : false}));
app.use(express.static(__dirname+"/client/"));

//routes
app.use('/api/v1/chat/users',users);

//express global error handler
app.use(globalErrorHandler);

mongoose.connect(config.get('db'),{useUnifiedTopology: true,useNewUrlParser:true,useCreateIndex:true})
    .then(console.log("Connected to db"))
    .catch((err)=>console.log("DB Connection failed",err));


const server = http.createServer(app);
server.listen(config.get('port'),()=>{console.log("Started")});
// app.listen(config.get('port'),()=>{
//     console.log("listening on 3000");
//     //console.log(config.get('key'));
//     //console.log(process.env.jsonWebTokenKey);
// });

socketLib.setUser(server);



