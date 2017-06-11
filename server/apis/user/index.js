/**
 * Created by phanmduong on 15/03/2017.
 */
var express = require('express');

var router = express.Router();
var UserController = require('./user.controller');
var Auth = require('../auth/auth.service');

router.post('/register', UserController.addUser);
router.post('/login', UserController.login);
router.get('/login/check-login', UserController.checkLogin);
router.get('/:id', UserController.getUser);
router.post('/update',  Auth.authentication(), UserController.updateUser);
router.post('/updatePassword',  Auth.authentication(), UserController.updatePassword);

module.exports = router;
