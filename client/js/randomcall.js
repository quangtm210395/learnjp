var socket;
var templates = {};
var dataTempplate = {};
var sourceSubcriber;
var subcriberTemplate;
var peer_opponent;

$(document).ready(function () {
    templates.chatMySelf = Handlebars.compile($('#template-chat-myself').html());
    templates.chatFriend = Handlebars.compile($('#template-chat-friend').html());

    socket = io.connect();
    dataTempplate.isSearch = true;
    sourceSubcriber = $("#template-subcriber").html();
    subcriberTemplate = Handlebars.compile(sourceSubcriber);
    var subcriberHtml = subcriberTemplate(dataTempplate);
    $('#subscriber').html(subcriberHtml);

    socket.emit('find peer', {id: peer_id});
    socket.on('peer opponent', function (data) {
        dataTempplate.isSearch = false;
        dataTempplate.isConnect = true;
        var subcriberHtml = subcriberTemplate(dataTempplate);
        $('#subscriber').html(subcriberHtml);
        peer_opponent = data.peer_opponent;
        if (data.isGetRoom) {
            $.post('/api/videocall/room-random', {
                peer_id_sender: peer_id,
                peer_id_receive: peer_opponent
            }, function (data, status) {
                socket.emit('get room', {id: peer_opponent});
                if (data.status) {
                    var apiKey = data.result.apiKey;
                    var sessionId = data.result.sessionId;
                    var token = data.result.token;
                    initializeSession(apiKey, sessionId, token);
                } else {
                    console.log(data.message);
                }

            });
        }
    });

    socket.on('get room data', function () {
        $.post('/api/videocall/room-random', {
            peer_id_sender: peer_id,
            peer_id_receive: peer_opponent
        }, function (data, status) {
            if (data.status) {
                var apiKey = data.result.apiKey;
                var sessionId = data.result.sessionId;
                var token = data.result.token;
                initializeSession(apiKey, sessionId, token);
            } else {
                console.log(data.message);
            }
        });
        });
});


function initializeSession(apiKey, sessionId, token) {
    var session = OT.initSession(apiKey, sessionId);
        // Subscribe to a newly created stream

    // Connect to the session
    session.connect(token, function (error) {
        // If the connection is successful, initialize a publisher and publish to the session
        if (!error) {
            var publisher = OT.initPublisher('publisher', {
                fitMode: "contain",
                width: '20%',
                height: '30%'
            });
            session.publish(publisher);
        } else {
            console.log('There was an error connecting to the session: ', error.code, error.message);
        }
    });

    session.on('streamCreated', function (event) {
        $("#mainContent").addClass("found");
        chat();
        $('.container-bg').hide();
        var subscriber = session.subscribe(event.stream, 'subscriber', {
            insertMode: 'append',
            fitMode: "contain",
            width: '100%',
            height: '100%'
        });
    });

    session.on('connectionDestroyed', function (event) {
        $("#mainContent").removeClass("found");
        $('.container-bg').show();
        dataTempplate.isDisconnect = true;
        socket.disconnect();
        session.disconnect();
        var subcriberHtml = subcriberTemplate(dataTempplate);
        $('#subscriber').html(subcriberHtml);
    })
}

function chat(){
    socket.on('randomchat', function(data) {
        $("#chatBox").append(templates.chatFriend(data));
        scrollToBottom();
    });
}

function sendMessage(e) {
    var msg = $('#sendBox').val().trim();
    if (e.keyCode === 13 && msg != "") {
        var message = {
            message: msg
        };
        socket.emit('randomchat', {
            senderId: peer_id,
            receiverId: peer_opponent,
            message: msg
        });
        $("#chatBox").append(templates.chatMySelf(message));
        $('#sendBox').val("");
        scrollToBottom();
    }
}

chatFocus = function () {
    $("#sendBox").focus();
}

scrollToBottom = function () {
    $("#nubBox").scrollTop($("#nubBox").prop("scrollHeight"));
}

function closeWindow() {
    window.close();
}