/**
 * Created by phanmduong on 15/03/2017.
 */
var OpenTok = require('opentok');
const config = require('../../configs');
var opentok = new OpenTok(config.apiKey, config.apiSecret);
var room = require('./videocall.model').room;
const uuidV4 = require('uuid/v4');

function sendResponse(res, sessionId) {
    var token = opentok.generateToken(sessionId);
    res.json({
        status: true,
        message: "Successful.",
        result: {
            apiKey: config.apiKey,
            sessionId: sessionId,
            token: token
        }
    });
}
module.exports = {

    createOrJoinRoom: function (req, res) {
        var peer_id1 = req.query.peer_id;
        var peer_id2 = req.user._id;
        if (!peer_id1) res.json({status: false, message: "Need peer id."});
        var roomName = (peer_id1 < peer_id2) ? peer_id1 + "@" + peer_id2 : peer_id2 + "@" + peer_id1;
        if (!room[roomName]) {
            opentok.createSession(function (err, session) {
                room[roomName] = {
                    sessionId: session.sessionId,
                    peer_id2: peer_id2
                };
                sendResponse(res, session.sessionId);

            });
        } else {
            if (room[roomName].peer_id1 === peer_id2 || room[roomName].peer_id2 === peer_id2) {
                res.json({status: false, message: "Connected"});
            } else if (!room[roomName].peer_id1) {
                room[roomName].peer_id1 = peer_id2;
                sendResponse(res, room[roomName].sessionId);
            } else if (!room[roomName].peer_id2) {
                room[roomName].peer_id2 = peer_id2;
                sendResponse(res, room[roomName].sessionId);
            } else
                res.json({status: false, message: "No connected."});
        }
    },

    createOrJoinRoomRandom: function (req, res) {
        var peer_id1 = req.body.peer_id_sender;
        var peer_id2 = req.body.peer_id_receive;
        if (!peer_id1 || !peer_id2) res.json({status: false, message: "Need peer id."});
        var roomName = (peer_id1 < peer_id2) ? peer_id1 + "@" + peer_id2 : peer_id2 + "@" + peer_id1;
        if (!room[roomName]) {
            opentok.createSession(function (err, session) {
                if (err) return console.log(err);
                room[roomName] = {
                    sessionId: session.sessionId,
                    peer_id2: peer_id2
                };
                sendResponse(res, session.sessionId);

            });
        } else {
            if (room[roomName].peer_id1 === peer_id2 || room[roomName].peer_id2 === peer_id2) {
                res.json({status: false, message: "Connected"});
            } else if (!room[roomName].peer_id1) {
                room[roomName].peer_id1 = peer_id2;
                sendResponse(res, room[roomName].sessionId);
            } else if (!room[roomName].peer_id2) {
                room[roomName].peer_id2 = peer_id2;
                sendResponse(res, room[roomName].sessionId);
            } else
                res.json({status: false, message: "No connected."});
        }
    },
};