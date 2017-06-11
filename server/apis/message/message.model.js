var mongoose = require('mongoose');

var message = mongoose.Schema({
    content: String,
    sender: {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
    receiver: {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
    conversationId: String
}, {timestamps: true});

module.exports = mongoose.model('Message', message);
