
const mongoose = require('mongoose');
const shortid = require('shortid');
const moment = require('moment');
const generateResponse = require('../libs/responseLib');
const winLog = require('../libs/winstonLogger');
const validateInput = require('../libs/paramsValidator');
const tokenLib = require('../libs/tokenLib');

/* Models */
const Chat = mongoose.model('Chat')
const User = mongoose.model('User')
const Auth = mongoose.model('Auth')


let getUsersChat = (req, res) => {
  // function to validate params.
  let validateParams = () => {
    return new Promise((resolve, reject) => {
      if (req.query.senderId == null || req.query.senderId == undefined ||req.query.senderId == "" || req.query.receiverId == null || req.query.receiverId == undefined ||req.query.receiverId == "") {
        logger.info('parameters missing', 'getUsersChat handler', 9)
        let apiResponse = generateResponse(true, 403, 'parameters missing.', null)
        reject(apiResponse)
      } else {
        resolve()
      }
    })
  } // end of the validateParams function.

  // function to get chats.
  let findChats = () => {
    return new Promise((resolve, reject) => {
      // creating find query.
      let findQuery = {
        $or: [
          {
            $and: [
              {senderId: req.query.senderId},
              {receiverId: req.query.receiverId}
            ]
          },
          {
            $and: [
              {receiverId: req.query.senderId},
              {senderId: req.query.receiverId}
            ]
          }
        ]
      }
    
      Chat.find(findQuery)
        .select('-_id -__v -chatRoom')
        .skip(parseInt(req.query.skip) || 0)
        .lean()
        .limit(10)
        .exec((err, result) => {
          if (err) {
            console.log(err)
            winLog.logError(err.message, 'Chat Controller: getUsersChat')
            let apiResponse = generateResponse(true,  500,`error occurred: ${err.message}`, null)
            reject(apiResponse)
          } else if (result == null || result == undefined || result =="") {
            winLog.logInfo('No Chat Found', 'Chat Controller: getUsersChat')
            let apiResponse = generateResponse(true, 404,'No Chat Found',  null)
            reject(apiResponse)
          } else {
            console.log('chat found and listed.')

            // reversing array.
            let reverseResult = result.reverse()

            resolve(result)
          }
        })
    })
  } // end of the findChats function.

  // making promise call.
  validateParams()
    .then(findChats)
    .then((result) => {
      let apiResponse = generateResponse(false,200, 'All Chats Listed',  result)
      res.send(apiResponse)
    })
    .catch((error) => {
      res.send(error)
    })
} // end of the getUsersChat function.

/**
 * function to retrieve chat of the group.
 * params: chatRoom, skip.
 */
let getGroupChat = (req, res) => {
  // function to validate params.
  let validateParams = () => {
    return new Promise((resolve, reject) => {
      if (req.query.chatRoom==null || req.query.chatRoom==undefined  || req.query.chatRoom=="" ) {
        winLog.logInfo('parameters missing', 'getUsersChat handler')
        let apiResponse = generateResponse(true, 403, 'parameters missing.', null)
        reject(apiResponse)
      } else {
        resolve()
      }
    })
  } // end of the validateParams function.

  // function to get chats.
  let findChats = () => {
    return new Promise((resolve, reject) => {
      // creating find query.
      let findQuery = {
        chatRoom: req.query.chatRoom
      }

      Chat.find(findQuery)
        .select('-_id -__v -receiverName -receiverId')
        .skip(parseInt(req.query.skip) || 0)
        .lean()
        .limit(10)
        .exec((err, result) => {
          if (err) {
            console.log(err)
            winLog.logError(err.message, 'Chat Controller: getUsersChat')
            let apiResponse = generateResponse(true, 500, `error occurred: ${err.message}`, null)
            reject(apiResponse)
          } else if (result == null || result ==undefined || result == "") {
            winLog.logInfo('No Chat Found', 'Chat Controller: getUsersChat')
            let apiResponse = response.generate(true, 404, 'No Chat Found', null)
            reject(apiResponse)
          } else {
            console.log('chat found and listed.')

            // reversing array.
            let reverseResult = result.reverse()

            resolve(result)
          }
        })
    })
  } // end of the findChats function.

  // making promise call.
  validateParams()
    .then(findChats)
    .then((result) => {
      let apiResponse = generateResponse(false, 200,'All Group Chats Listed',  result)
      res.send(apiResponse)
    })
    .catch((error) => {
      res.send(error)
    })
} // end of the getGroupChat function.

/**
 * function to mark multi chat as seen.
 * params: chatIdCsv
 */
let markChatAsSeen = (req, res) => {
  // function to validate params.
  let validateParams = () => {
    return new Promise((resolve, reject) => {
      if (req.query.chatIdCsv==null ||req.query.chatIdCsv==undefined ||req.query.chatIdCsv=="" ) {
        winLog.logInfo('parameters missing', 'markChatAsSeen handler')
        let apiResponse = generateResponse(true,  403,'parameters missing.', null)
        reject(apiResponse)
      } else {
        resolve()
      }
    })
  } // end of the validateParams function.

  // function to mark chat as seen.
  let modifyChat = () => {
    return new Promise((resolve, reject) => {
      let findQuery = {
        chatId: req.query.chatIdCsv
      }

      let updateQuery = {
        seen: true
      }

      Chat.update(findQuery, updateQuery, {multi: true})
      .exec((err, result) => {
        if (err) {
          console.log(err)
          winLog.logError(err.message, 'Chat Controller: markChatAsSeen')
          let apiResponse = generateResponse(true,  500,`error occurred: ${err.message}`, null)
          reject(apiResponse)
        } else if (result.n === 0) {
          winLog.logInfo('No Chat Found', 'Chat Controller: markChatAsSeen')
          let apiResponse = generateResponse(true, 404, 'No Chat Found', null)
          reject(apiResponse)
        } else {
          console.log('chat found and updated.')

          resolve(result)
        }
      })
    })
  } // end of the modifyChat function.

  // making promise call.
  validateParams()
    .then(modifyChat)
    .then((result) => {
      let apiResponse = generateResponse(false, 200, 'chat found and updated.', result)
      res.send(apiResponse)
    })
    .catch((error) => {
      res.send(error)
    })
} // end of the markChatAsSeen function.

/**
 * function to get number of unread messages.
 * params: userId, senderId.
 */
let countUnSeenChat = (req, res) => {
  // function to validate params.
  let validateParams = () => {
    return new Promise((resolve, reject) => {
      if (req.query.userId == null || req.query.userId == undefined || req.query.userId == "") {
        winLog.logInfo('parameters missing', 'countUnSeenChat handler')
        let apiResponse = generateResponse(true, 403, 'parameters missing.', null)
        reject(apiResponse)
      } else {
        resolve()
      }
    })
  } // end of the validateParams function.

  // function to get chats.
  let countChat = () => {
    return new Promise((resolve, reject) => {
      // creating find query.
      let findQuery = {}

      findQuery['receiverId'] = req.query.userId
      findQuery['seen'] = false

      if (!(req.query.senderId == null || req.query.senderId == undefined || req.query.senderId == "")) {
        findQuery['senderId'] = req.query.senderId
      }

      Chat.count(findQuery)
        .exec((err, result) => {
          if (err) {
            console.log(err)
            winLog.logError(err.message, 'Chat Controller: countUnSeenChat')
            let apiResponse = generateResponse(true, 500, `error occurred: ${err.message}`, null)
            reject(apiResponse)
          } else {
            console.log('unseen chat count found.')

            resolve(result)
          }
        })
    })
  } // end of the countChat function.

  // making promise call.
  validateParams()
    .then(countChat)
    .then((result) => {
      let apiResponse = generateResponse(false, 200, 'unseen chat count found.', result)
      res.send(apiResponse)
    })
    .catch((error) => {
      res.send(error)
    })
} // end of the countUnSeenChat function.

/**
 * function to get unread messages.
 * params: userId, senderId.
 */
let findUnSeenChat = (req, res) => {
  // function to validate params.
  let validateParams = () => {
    return new Promise((resolve, reject) => {
      if (req.query.userId == null || req.query.userId == undefined || req.query.userId == "") {
        winLog.logInfo('parameters missing', 'findUnSeenChat handler')
        let apiResponse = generateResponse(true, 403, 'parameters missing.', null)
        reject(apiResponse)
      } else {
        resolve()
      }
    })
  } // end of the validateParams function.

  // function to get chats.
  let findChats = () => {
    return new Promise((resolve, reject) => {
      // creating find query.
      let findQuery = {}

      findQuery['receiverId'] = req.query.userId
      findQuery['seen'] = false

      if (!(req.query.senderId == null || req.query.senderId == undefined || req.query.senderId == "")) {
        findQuery['senderId'] = req.query.senderId
      }

      ChatModel.find(findQuery)
        .select('-_id -__v')
        .skip(parseInt(req.query.skip) || 0)
        .lean()
        .limit(10)
        .exec((err, result) => {
          if (err) {
            console.log(err)
            winLog.logError(err.message, 'Chat Controller: findUnSeenChat')
            let apiResponse = generateResponse(true, 500, `error occurred: ${err.message}`, null)
            reject(apiResponse)
          } else if (result == null || result == undefined || result=="") {
            winLog.logInfo('No Chat Found', 'Chat Controller: findUnSeenChat')
            let apiResponse = generateResponse(true, 404, 'No Chat Found', null)
            reject(apiResponse)
          } else {
            console.log('chat found and listed.')

            // reversing array.
            let reverseResult = result.reverse()

            resolve(result)
          }
        })
    })
  } // end of the findChats function.

  // making promise call.
  validateParams()
    .then(findChats)
    .then((result) => {
      let apiResponse = generateResponse(false, 200, 'chat found and listed.', result)
      res.send(apiResponse)
    })
    .catch((error) => {
      res.send(error)
    })
} // end of the findUnSeenChat function.

/**
 * function to find user from whom chat is unseen.
 * params: userId.
 */
let findUserListOfUnseenChat = (req, res) => {
  console.log('--- inside findUserListOfChat function ---')

  // function to validate params.
  let validateParams = () => {
    return new Promise((resolve, reject) => {
      if (req.query.userId == null || req.query.userId == undefined || req.query.userId == "") {
        winLog.logError('parameters missing', 'findUserListOfUnseenChat handler')
        let apiResponse = generateResponse(true, 403, 'parameters missing.', null)
        reject(apiResponse)
      } else {
        resolve()
      }
    })
  } // end of the validateParams function.

  // find distinct sender.
  let findDistinctSender = () => {
    return new Promise((resolve, reject) => {
      Chat.distinct('senderId', {receiverId: req.query.userId, seen: false})
        .exec((err, senderIdList) => {
          if (err) {
            console.log(err)
            winLog.logError(err.message, 'Chat Controller: findUserListOfUnseenChat')
            let apiResponse = generateResponse(true,500, `error occurred: ${err.message}`,  null)
            reject(apiResponse)
          } else if (senderIdList == null || senderIdList == undefined || senderIdList == "") {
            winLog.logInfo('No Unseen Chat User Found', 'Chat Controller: findUserListOfUnseenChat')
            let apiResponse = generateResponse(true,404, 'No Unseen Chat User Found',  null)
            reject(apiResponse)
          } else {
            console.log('User found and userIds listed.')

            console.log(senderIdList)

            resolve(senderIdList)
          }
        })
    })
  } // find findDistinctSender function.

  // function to find user info.
  let findUserInfo = (senderIdList) => {
    return new Promise((resolve, reject) => {
      UserModel.find({userId: {$in: senderIdList}})
        .select('-_id -__v -password -email -mobileNumber')
        .lean()
        .exec((err, result) => {
          if (err) {
            console.log(err)
            winLog.logError(err.message, 'Chat Controller: findUserListOfUnseenChat')
            let apiResponse = generateResponse(true, 500, `error occurred: ${err.message}`, null)
            reject(apiResponse)
          } else if (result == null || result == undefined || result == "") {
            winLog.logInfo('No User Found', 'Chat Controller: findUserListOfUnseenChat')
            let apiResponse = generateResponse(true, 404, 'No User Found', null)
            reject(apiResponse)
          } else {
            console.log('User found and userIds listed.')

            // console.log(result)

            resolve(result)
          }
        })
    })
  } // end of the findUserInfo function.

  // making promise call.
  validateParams()
    .then(findDistinctSender)
    .then(findUserInfo)
    .then((result) => {
      let apiResponse = generateResponse(false, 200, 'user found and listed.', result)
      res.send(apiResponse)
    })
    .catch((error) => {
      res.send(error)
    })
} // end of the findUserListOfUnseenChat function.

/**
 * exporting functions.
 */
module.exports = {
  getUsersChat: getUsersChat,
  getGroupChat: getGroupChat,
  markChatAsSeen: markChatAsSeen,
  countUnSeenChat: countUnSeenChat,
  findUnSeenChat: findUnSeenChat,
  findUserListOfUnseenChat: findUserListOfUnseenChat
}
