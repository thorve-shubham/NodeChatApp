const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const chatController = require('../controllers/chatController');

router.get(`/get/for/user`, auth, chatController.getUsersChat);

// params: chatRoom, skip.
router.get(`/get/for/group`, auth, chatController.getGroupChat);


// params: chatIdCsv.
router.post(`/mark/as/seen`, auth, chatController.markChatAsSeen);

// params: userId, senderId.
router.get(`/count/unseen`, auth, chatController.countUnSeenChat);

 // params: userId, senderId, skip.
router.get(`/find/unseen`, auth, chatController.findUnSeenChat);

   // params: userId.
router.get(`/unseen/user/list`, auth, chatController.findUserListOfUnseenChat);

module.exports = router;