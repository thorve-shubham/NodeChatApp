module.exports = function(err,status,errMsg,succMsg){
    return {
        isError : err,
        Status : status,
        ErrorMsg : errMsg,
        SuccessMsg : succMsg
    }
}