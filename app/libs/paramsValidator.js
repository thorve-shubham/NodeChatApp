const Joi = require('Joi');

function validateEmail(email){
    return Joi.validate(email,Joi.string().email().required()); 
}

function validatePassword(password){
    return Joi.validate(password,Joi.string().regex(/^[A-Za-z0-9]\w{7,}$/)); //regex password validation
}

module.exports.email = validateEmail;
module.exports.password = validatePassword;