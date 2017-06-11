/**
 * Created by phanmduong on 17/05/2017.
 */
var express = require('express');

var router = express.Router();
var VideoCallController = require('./videocall.controller');
var Auth = require('../auth/auth.service');

router.post('/room', Auth.authentication(), VideoCallController.createOrJoinRoom);
router.post('/room-random', VideoCallController.createOrJoinRoomRandom);

module.exports = router;