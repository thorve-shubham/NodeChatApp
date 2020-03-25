const bcrypt = require('bcrypt');

function hashPassword(password){
    const salt = bcrypt.genSaltSync(10);
    return bcrypt.hashSync(password,salt);

}

function comparePassword(enteredPass,orignalPass){
    return bcrypt.compareSync(enteredPass,orignalPass);
}

module.exports.hashPassword = hashPassword;
module.exports.comparePassword = comparePassword;