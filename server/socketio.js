/**
 * Created by phanmduong on 4/27/17.
 */

const userController = require('./apis/user/user.controller');
const messageController = require('./apis/message/message.controller');
//const Conversation = require('./apis/conversation/conversation.model');
const User = require('./apis/user/user.model');

var room = require('./apis/videocall/videocall.model').room;
var peerRandom = [];

module.exports = (io) => {

    io.on('connection', function (socket) {
        updateStatusUsers(socket);
        socket.on('login', function (data) {
            socket.id = data.id;
            socket.username = data.username;
            updateStatusUsers(io);
        });

        socket.on('disconnect', function () {
            disconnectVideoCall(socket);
            deletePeerRandom(socket);
            socket.username = undefined;
            socket.id = undefined;
            updateStatusUsers(io);
            
        });

        socket.on('logout', function () {
            socket.username = undefined;
            socket.id = undefined;
            updateStatusUsers(io);
        });

        socket.on('chat', function (data) {
            createMessage(data);
        });

        socket.on('find peer', function (data) {
            socket.id = data.id;
            peerRandom.push({
                id: data.id,
                ipAddress: socket.request.connection.remoteAddress
            });
            findPeer();
        });

        socket.on('create call', function (data) {
            socket.isCall = true;
            socket.id = data.peer_id_sender;
            socket.peer_id1 = data.peer_id_receive;
            socket.peer_id2 = data.peer_id_sender;
            checkHideModalAccessCall(socket);
            // kiêm tra đã có ai join cuộc gọi chưa. nếu chưa thì sẽ emit đến thằng đối phương để yêu cầu chập nhận cuộc gọi
            if (!checkJoinedCall(socket)) {
                io.sockets.clients(function (error, clients) {
                    clients.forEach(function (client) {
                        if (io.sockets.sockets[client].id === data.peer_id_receive) {
                            userController.getUserCallback(data.peer_id_sender, function (user) {
                                io.sockets.sockets[client].emit('join call', user);
                            });
                        }
                    });
                });
            } else {
                io.sockets.clients(function (error, clients) {
                    clients.forEach(function (client) {
                        if (io.sockets.sockets[client].id === data.peer_id_sender) {
                            io.sockets.sockets[client].emit('joined call', {joined: true});
                        }
                    });
                });
            }
        });

        socket.on('get room', function (data) {
            io.sockets.clients(function (error, clients) {
                clients.forEach(function (client) {
                    if (io.sockets.sockets[client].id === data.id) {
                        io.sockets.sockets[client].emit('get room data', {});
                    }
                });
            });
        });

        socket.on('access call', function (data) {
            io.sockets.clients(function (error, clients) {
                clients.forEach(function (client) {
                    if (io.sockets.sockets[client].id === data.peer_id) {
                        io.sockets.sockets[client].emit('reply access call', {
                            accepted: data.accepted
                        })
                    }
                });
            });
        });

        socket.on('typing', function (data) {
            io.sockets.clients(function (error, clients) {
                clients.forEach(function (client) {
                    if (io.sockets.sockets[client].id === data.receiverId) {
                        io.sockets.sockets[client].emit('typing', data);
                    }
                });
            });
        });

        socket.on('randomchat', function (data) {
            randomChat(data);
        })
    });

    function checkJoinedCall(socket) {
        if (socket.isCall) {
            var peer_id1 = socket.peer_id1;
            var peer_id2 = socket.peer_id2;
            var roomName = (peer_id1 < peer_id2) ? peer_id1 + "@" + peer_id2 : peer_id2 + "@" + peer_id1;
            if (!room[roomName]) return false;

            // kiểm tra đã có id của thằng được gọi có trong room chưa peer_id1 tương đương với thằng được gọi
            if (room[roomName].peer_id1 === peer_id1) {
                return true;
            } else {
                if (room[roomName].peer_id2 === peer_id1) {
                    return true;
                }
            }
        }
        return false;
    }

    function disconnectVideoCall(socket) {
        if (socket.isCall) {
            var peer_id1 = socket.peer_id1;
            var peer_id2 = socket.peer_id2;
            var roomName = (peer_id1 < peer_id2) ? peer_id1 + "@" + peer_id2 : peer_id2 + "@" + peer_id1;
            if (room[roomName]) {
                if (room[roomName].peer_id1 === socket.id) {
                    room[roomName].peer_id1 = null;
                } else {
                    if (room[roomName].peer_id2 === socket.id) {
                        room[roomName].peer_id2 = null;
                    }
                }
            }
        }
    }

    function updateStatusUsers(browser) {
        listUser(function (users) {
            browser.emit('update status users', {users: users});
        });
    }

    function setOnline(user, callback) {
        io.sockets.clients(function (error, clients) {
            clients.forEach(function (client) {
                if (io.sockets.sockets[client].username === user.username) {
                    user.isOnline = true;
                }
            });
            callback();
        });
    }

    function findPeer() {
        var peer_1;
        var peer_2;
        if (peerRandom.length >= 2) {
            var index1 = Math.floor(Math.random() * (peerRandom.length - 1));
            peer_1 = peerRandom[index1];
            peerRandom.splice(index1, 1);
            var index2 = Math.floor(Math.random() * (peerRandom.length - 1));
            peer_2 = peerRandom[index2];
            peerRandom.splice(index2, 1);
            console.log("connect random call" + peer_1 + " " + peer_2);
            io.sockets.clients(function (error, clients) {
                clients.forEach(function (client) {
                    if (io.sockets.sockets[client].id === peer_1.id) {
                        io.sockets.sockets[client].emit("peer opponent", {peer_opponent: peer_2.id, isGetRoom: true});
                    }
                    if (io.sockets.sockets[client].id === peer_2.id) {
                        io.sockets.sockets[client].emit("peer opponent", {peer_opponent: peer_1.id, isGetRoom: false});
                    }
                });
            })
        }
    }

    function listUser(callback) {
        userController.getAll(function (users) {
            users.forEach(function (user, index) {
                setOnline(user, function () {
                    if (index === users.length - 1) callback(users);
                })
            });
        });
    };

    function createMessage(data) {
        messageController.createMessageCallback({
            content: data.message,
            sender: data.sender._id,
            receiver: data.receiverId
        }, function (conversation) {
            io.sockets.clients(function (error, clients) {
                clients.forEach(function (client) {
                    if (io.sockets.sockets[client].id === data.receiverId) {
                        io.sockets.sockets[client].emit('chat', {
                            sender: data.sender,
                            receiverId: data.receiverId,
                            messageData: {
                                imgUrl: data.sender.imgUrl,
                                message: data.message
                            }
                        });
                    }
                });
            });
        });
    }

    function randomChat(data) {
        io.sockets.clients(function (error, clients) {
            clients.forEach(function (client) {
                if (io.sockets.sockets[client].id === data.receiverId) {
                    io.sockets.sockets[client].emit('randomchat', data);
                }
            });
        });
    }

    function checkHideModalAccessCall(socket) {
        var peer_id1 = socket.peer_id1;
        var peer_id2 = socket.peer_id2;
        var roomName = (peer_id1 < peer_id2) ? peer_id1 + "@" + peer_id2 : peer_id2 + "@" + peer_id1;
        if (!room[roomName]) return;

        // kiểm tra đã có id của thằng được gọi có trong room chưa peer_id1 tương đương với thằng được gọi
        if (room[roomName].peer_id1 && room[roomName].peer_id2) {
            io.sockets.clients(function (error, clients) {
                clients.forEach(function (client) {
                    if (io.sockets.sockets[client].id === room[roomName].peer_id1) {
                        io.sockets.sockets[client].emit('hide modal access call', {
                            peer_opponent: room[roomName].peer_id2
                        })
                    }
                    if (io.sockets.sockets[client].id === room[roomName].peer_id2) {
                        io.sockets.sockets[client].emit('hide modal access call', {
                            peer_opponent: room[roomName].peer_id1
                        })
                    }
                });
            });
        }
    }
    
    function deletePeerRandom(socket) {
        peerRandom.forEach(function (peer, index) {
            if (peer.id === socket.id){
                peerRandom.splice(index, 1);
                return;
            }
        })
    }
};
