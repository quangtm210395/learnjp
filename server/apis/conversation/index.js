var express = require('express');

var router = express.Router();
var ConversationController = require('./conversation.controller');
var Auth = require('../auth/auth.service');

router.get('/get/:friendId', Auth.authentication(), ConversationController.getConversation);
router.get('/get20/:friendId', Auth.authentication(), ConversationController.getConversationBy20);

module.exports = router;
