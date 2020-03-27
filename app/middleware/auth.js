const generateResponse = require('../libs/responseLib');
const Auth = require('../Models/auth');
const winLog = require('../libs/winstonLogger');
const tokenLib = require('../libs/tokenLib');

module.exports = (req,res,next)=>{
    if(req.params.authToken || req.query.authToken || req.body.authToken || req.header('authToken')){
        Auth.findOne({authToken : req.params.authToken || req.query.authToken || req.body.authToken || req.header('authToken')})
            .select('-_id-__v')
            .exec((err,retAuth)=>{
                if(err){
                    winLog.logError(err.message,"Middleware : auth");
                   return  res.send(generateResponse(true,503,err.message,null));
                }else if(retAuth == null || retAuth == undefined || retAuth == ""){
                    winLog.logError("Auth Token is not found","Middleware : auth");
                    return res.send(generateResponse(true,503,"Auth Token is not found",null));
                }else{
                    tokenLib.comapreToken(retAuth.authToken,(err,decodedData)=>{
                        if(err){
                            winLog.logError("Auth Token is not valid","Middleware : auth");
                            return res.send(generateResponse(true,503,"Auth Token is not valid",null)); 
                        }else{
                            req.user = {userId : decodedData.data.userId};
                            next();
                        }
                    });
                }
            });
    }else{
        return res.send(generateResponse(true,403,"Auth Token was not Provided",null));
    }
}