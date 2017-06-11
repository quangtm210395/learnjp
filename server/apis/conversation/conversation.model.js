var mongoose = require('mongoose');

var conversation = mongoose.Schema({
    id: {
        type: String,
        unique: true
    },
    messages: [{type: mongoose.Schema.Types.ObjectId, ref: 'Message'}],

    friend: Object,
    nextUrl: String
});

module.exports = mongoose.model('Conversation', conversation);
