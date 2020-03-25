const generateResponse = require('../libs/responseLib');
const validate = require('../libs/paramsValidator');
const User = require('../Models/user');
const Auth = require('../Models/auth');
const winLog = require('../libs/winstonLogger');
const shortid = require('shortid');
const bcrypt = require('../libs/bcryptLib');
const moment = require('moment'); 
const tokenLib = require('../libs/tokenLib');

function logIn(req,res){

    function validatePassword(user){
        return new Promise((resolve,reject)=>{
            if(!bcrypt.comparePassword(req.body.password,user.password)){
                winLog.logError("Invalid Password","userController : validatePassword");
                let Response = generateResponse(true,500,"Invalid Password",null);
                reject(Response);
            }else{
                let userObj = user.toObject();
                delete userObj.password;
                delete userObj._id;
                delete userObj.createdOn;
                delete userObj.__v;
                resolve(userObj);
            }
        })
    }

    validateUserInput(req)
        .then(findUser)
        .then(validatePassword)
        .then(generateToken)
        .then(saveToken)
        .then((Response)=>{
            res.send(generateResponse(false,200,null,Response));
        })
        .catch((err)=>{
            res.send(err);
        });

}

function saveToken(token){
    return new Promise((resolve,reject)=>{
        Auth.findOne({userId : token.userId}).select("-_id-__v")
            .exec((err,retToken)=>{
                if(err){
                    winLog.logError("Token saving problem : "+err.message,"userController : saveToken");
                    let Response = generateResponse(true,500,"Token saving failed",null);
                    reject(Response);
                }else if(retToken == null || retToken == undefined || retToken == ""){
                    const auth = new Auth({
                        userId : token.userId,
                        authToken : token.token,
                        tokenSecret : token.secret,
                        createdOn : moment().format()
                    });
                    
                    auth.save((err,result)=>{
                        if(err){
                            winLog.logError("Token saving problem : "+err.message,"userController : saveToken");
                            let Response = generateResponse(true,500,"Token saving failed",null);
                            reject(Response); 
                        }else{
                            let Response = {
                                authToken : result.authToken,
                                userId : result.userId,
                            }
                            resolve(Response);
                        }
                    })
                }else{
                    retToken.token = token.token;
                    retToken.secret = token.secret;
                    retToken.createdOn = moment().format();
                    retToken.save((err,result)=>{
                        if(err){
                            winLog.logError("Token saving problem : "+err.message,"userController : saveToken");
                            let Response = generateResponse(true,500,"Token saving failed",null);
                            reject(Response); 
                        }else{
                            let Response = {
                                authToken : result.token,
                                userId : result.userId,
                            }
                            resolve(Response);
                        }
                    }); 
                }
            });
    });
}

function generateToken(user){
    return new Promise((resolve,reject)=>{
        tokenLib.generateToken(user,(err,tokenInfo)=>{
            if(err){
                //console.log(token);
                winLog.logError("Token generation problem","userController : generateToken");
                let Response = generateResponse(true,500,"Token generation failed",null);
                reject(Response);
            }else{
                tokenInfo.userId = user.userId;
                resolve(tokenInfo);
            }
        });
    });
}

function findUser(req){
    return new Promise((resolve,reject)=>{
        User.findOne({email : req.body.email}).select('-_id-__v')
        .exec((err,user)=>{
            if(err){
                winLog.logError(err.message,"userController : findUser");
                let Response = generateResponse(true,404,"falied to find user",null);
                reject(Response);
            }else if(user==null || user ==undefined || user == ""){
                winLog.logError("Unable to find user","userController : findUser");
                let Response = generateResponse(true,404,"falied to find user",null);
                reject(Response);
            }else{
                winLog.logInfo("User found successfully","userController : findUser");
                resolve(user);
            }
        });
    });
    
}



function signUp(req,res){
    validateUserInput(req)
        .then(createUser)
        .then((user)=>{
            res.send(user);
        })
        .catch((err)=>{
            res.send(err);
        })
}

function logOut(req,res){

}

function validateUserInput(req){
    return new Promise((resolve,reject)=>{
        let {error} = validate.email(req.body.email);
        if(error){
            let Response = generateResponse(true,403,error.details[0].message,null);
            reject(Response);
        }
        let {errorp} = validate.password(req.body.password);
        if(error){
            let Response = generateResponse(true,403,errorp.details[0].message,null);
            reject(Response);
        }
        
        resolve(req);
    });
}

function createUser(req){
    return new Promise((resolve,reject)=>{
        User.findOne({email : req.body.email}).select("-_id-__v")
            .exec((err,data)=>{
                if(err){
                    winLog.logError(err.message,"userController : createUser");
                    let Response = generateResponse(true,404,"falied to create user",null);
                    reject(Response);
                }else if(data == null || data == undefined || data == ""){
                    let user = new User({
                        userId: shortid.generate(),
                        firstName: req.body.firstName,
                        lastName: req.body.lastName,
                        email: req.body.email,
                        mobileNumber: req.body.mobileNumber,
                        password: bcrypt.hashPassword(req.body.password),
                        createdOn: moment().format()
                    });
                    console.log(user.password);
                    user.save((err,result)=>{
                        if (err) {
                            console.log(err)
                            winLog.logError(err.message, 'userController: createUser')
                            let Response = generateResponse(true,500,'Failed to create new User', null)
                            reject(Response)
                        } else {
                            let userObj = user.toObject();
                            resolve(userObj);
                        }
                    });
                }else{
                    winLog.logError("User cannot be created as it is already registered","userController : createUser");
                    let Response = generateResponse(true,404,"falied to create user",null);
                    reject(Response);
                }
            })
    })
}

module.exports.logOut = logOut;
module.exports.signUp = signUp;
module.exports.logIn = logIn;
