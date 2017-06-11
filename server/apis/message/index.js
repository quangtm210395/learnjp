var express = require('express');

var router = express.Router();
var MessageController = require('./message.controller');
var Auth = require('../auth/auth.service');

router.post('/create', Auth.authentication(), MessageController.createMessage);

module.exports = router;
