var Feedback = require('./feedback.model');
var User = require('../user/user.model');
var jwt = require('jsonwebtoken');
var config = require('../../configs/index.js');

module.exports = {
    createFeedback: function(req, res) {
        var newFeedback = new Feedback(req.body);
        newFeedback.save(function(err, feedback){
            if (err) {
                res.json({status: false, message: err});
            } else {
                res.json({status: true, message: "Feedback thành công"});
            }
        });
    },

    getAllFeedback: function(req, res) {
        Feedback.find({}, {'_id': 0, '__v': 0})
            .exec(function(err, feedbacks){
              if (err) {
                  res.json({status: false, message: err});
              } else {
                  res.json({status: true, message: "Thành công", result: feedbacks});
              }
            })
    },

    getFeedbackBy10: function(req, res) {
      Feedback.count({}, function(err, count) {
          Feedback.find().select('-_id -__v')
              .sort('-createdAt')
              .skip(5 * parseInt(req.query.page))
              .limit(5)
              .exec(function (err, feedbacks) {
                  if (err) res.json({status: false, message: err});

                  if (count - 5*(parseInt(req.query.page)+1) <= 0) {
                      var nextUrl = "";
                  } else {
                      var nextUrl = "/api/feedback/getPart?page=" + (parseInt(req.query.page) + 1);
                  }
                  res.json({status: true, message: "Thành công", result: {feedbacks: feedbacks, nextUrl: nextUrl}});
              });
      });

    }
};
