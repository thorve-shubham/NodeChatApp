//libraries
const winstonI = require('winston');
const moment = require('moment');

//configuration of file
const winston = winstonI.createLogger({
    transports: [
        new winstonI.transports.File({filename : "logs.log" })
    ]
});

function logInfo(message,origin){
    let infoMessage = {
        timestamp: moment().format(),
        message: message,
        origin: origin
    }
    winston.info(infoMessage); 
}

function logError(message,origin){
    let errorMessage = {
        timestamp: moment().format(),
        message: message,
        origin: origin
    }
    winston.error(errorMessage); 
}

module.exports.logInfo = logInfo;
module.exports.logError = logError;
