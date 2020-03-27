const jwt = require('jsonwebtoken');
const config = require('config');

function generateToken(data,cb){
    try{
        let info = {
            exp: Math.floor(Date.now() / 1000) + (60 * 60 * 24),  //1day
            data : data
        }
        //console.log(config.get('key'));
        const tokenInfo = {
            token : jwt.sign(info,config.get('key')),
            secret : config.get('key')
        } 
        console.log(data);
        cb(null,tokenInfo);
    }
    catch(err){
        cb(err,null);
    }
    
}

function comapreToken(token,cb){
    try{
        const decodedToken = jwt.verify(token,config.get('key'));
        cb(null,decodedToken)
    }catch(err){
        cb(err,null)
    }
}

module.exports.generateToken =generateToken;
module.exports.comapreToken =comapreToken;