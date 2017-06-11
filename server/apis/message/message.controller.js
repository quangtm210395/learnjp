var Message = require('./message.model');
var User = require('../user/user.model');
var Conversation = require('../conversation/conversation.model');
var jwt = require('jsonwebtoken');
var config = require('../../configs/index.js');

module.exports = {
    createMessage: function(req, res) {
        req.body.sender = req.user._id;
        var newMessage = new Message(req.body);
        newMessage.save(function(err, message){
            if (err) res.json({status: false, message: err});

            if (message.sender < message.receiver) {
              conversationId = message.sender + "@" + message.receiver;
            } else {
              conversationId = message.receiver + "@" + message.sender;
            };
            Conversation.findOneAndUpdate({id: conversationId}, {$push: {messages: message}}, function(err, conversation){
              if (err) res.json({status: false, message: err});

              res.json({status: true, message: "Create message successfully", result: conversation});
            });
        });
    },

    createMessageCallback: function(data, callback) {
        if (data.sender < data.receiver) {
          var conversationId = data.sender + "@" + data.receiver;
        } else {
          var conversationId = data.receiver + "@" + data.sender;
        };
        data.conversationId = conversationId;
        var newMessage = new Message(data);
        newMessage.save(function(err, message){
            if (err) console.log({status: false, message: err});

            Conversation.findOneAndUpdate({id: conversationId}, {$push: {messages: message}}, function(err, conversation){
                if (err) console.log({status: false, message: err});
                callback(conversation);
            });
        });
    }
};
