var Conversation = require('./conversation.model');
var User = require('../user/user.model');
var Message = require('../message/message.model');
var jwt = require('jsonwebtoken');
var config = require('../../configs/index.js');

module.exports = {

    getConversation: function(req, res) {
      userId = req.user._id;
      friendId = req.params.friendId;

      User.findOne({_id: friendId})
        .exec(function(err, friend){
            if (err) {
                res.json({status: false, message: err.message});
                return;
            }

            if (userId < friendId) {
              conversationId = userId + "@" + friendId;
            } else {
              conversationId = friendId + "@" + userId;
            };
            Conversation.findOne({id: conversationId}, {'__v' : 0})
              .populate({path: 'messages', select: '-__v -_id'})
              .exec(function(err, conversation){
                  if (err) {
                    res.json({status: false, message: err.message});
                    return;
                  }

                  if (conversation) {
                      conversation.friend = friend;
                      res.json({status: true, message: "Get conversation successfully", result: conversation});
                  } else {
                      var newConversation = new Conversation({
                        id : conversationId,
                        messages : []
                      });
                      newConversation.save(function (err, conversation) {
                          if (err) {
                            res.json({status: false, message: err.message});
                            return;
                          }
                          conversation.friend = friend;
                          res.json({status: true, message: "Create conversation successful", result: conversation});
                      })
                  }
              });
        });
    },

    getConversationBy20: function(req, res) {
      userId = req.user._id;
      friendId = req.params.friendId;
      remainingMessages = req.query.remaining;

      User.findOne({_id: friendId}, {'salt' : 0, 'password': 0, '__v': 0, 'age': 0})
        .exec(function(err, friend){
            if (err) res.json({status: false, message: err.message});

            if (userId < friendId) {
              conversationId = userId + "@" + friendId;
            } else {
              conversationId = friendId + "@" + userId;
            };

            Message.where({conversationId: conversationId})
                .count(function(err, count){
                    if (count == 0) {
                        // chua co conversation giua 2 nguoi -> tao conversation
                        var newConversation = new Conversation({
                            id : conversationId,
                            messages : []
                        });
                        newConversation.save(function (err, conversation) {
                            if (err) res.json({status: false, message: err.message});
                            var result = {
                                friend: friend,
                                nextUrl: "",
                                messages: []
                            };
                            res.json({status: true, message: "Create conversation successful", result: conversation});
                        })
                    } else {

                        // co roi thi get tin nhan
                        if (remainingMessages == -1) remainingMessages = count; // lan dau lay
                        skippedMessages = count - remainingMessages;

                        Message.find({conversationId: conversationId})
                          .sort({'createdAt' : -1})
                          .skip(skippedMessages)
                          .limit(20)
                          .exec(function(err, messages){
                              if (err) res.json({status: false, message: err.message});

                              messages.reverse();
                              remainingMessages -= messages.length;
                              if (remainingMessages > 0) {
                                  nextUrl = "/get20/" + friendId + "?remaining=" + remainingMessages;
                              } else {
                                  nextUrl = "";
                              };

                              var result = {
                                  friend: friend,
                                  nextUrl: nextUrl,
                                  messages: messages
                              };
                              res.json({status: true, message: "Create conversation successful", result: result});
                          });
                    };
            });
        });
    }
};
