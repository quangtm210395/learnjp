var express = require('express');

var router = express.Router();
var FeedbackController = require('./feedback.controller');
var Auth = require('../auth/auth.service');

router.post('/create', FeedbackController.createFeedback);
router.get('/getAll', FeedbackController.getAllFeedback);
router.get('/getPart', FeedbackController.getFeedbackBy10);

module.exports = router;
