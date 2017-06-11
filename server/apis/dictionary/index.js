const express = require('express');
var controller = require('./dictionary.controller');

var router = express.Router();

router.post('/search', controller.search);
router.post('/kanji/:word', controller.kanji);
router.post('/sentence/:word', controller.sentence);
router.post('/grammars/:word', controller.grammars);
router.post('/grammar/:word', controller.grammar);

module.exports = router;