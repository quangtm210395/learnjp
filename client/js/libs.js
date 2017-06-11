changeTypeSearch = function (index) {
    var activeTab = parseInt($('.tab-active').attr('id').charAt(3));
    tabSelected = index;

    if (index != activeTab) {
        $(".search-input-container button").removeClass("tab-active");
        $("#tab" + index).addClass("tab-active");
        $(".tab-container .result").addClass("dis-cont");
        $("#result-content-" + index).removeClass("dis-cont");
        // reloadResources(index);
        var placeholder = "";
        var o;
        switch (index) {
            case 0:
                placeholder = "日本, nihon, Nhật Bản", o = "word";
                break;
            case 1:
                placeholder = "公, công", o = "kanji";
                break;
            case 2:
                placeholder = "優しい, yasashii, tốt bụng", o = "example";
                break;
            case 3:
                placeholder = "のに, để", o = "grammar"
        }
        $("#search-text-box").attr("placeholder", placeholder);
        $("#search-text-box").focus();
    }
}

changeTab = function (index) {
    var activeTab = parseInt($('.active').attr('id').charAt(3));

    if (index != activeTab) {
        $(".navbar-nav li").removeClass("active");
        $("#nav" + index).addClass("active");

        if (index == 0) {
            $("#viewContent").show();
            $("#feedback").hide();
            $("#profile").hide();
            $("#password").hide();
        } else if (index == 1) {
            $("#feedback").show();
            $("#viewContent").hide();
            $("#profile").hide();
            $("#password").hide();
        } else if (index == 3) {
            setUserInfo();
            $("#profile").show();
            $("#viewContent").hide();
            $("#feedback").hide();
            $("#password").hide();
        } else if (index == 4) {
            $("#password").show();
            $("#profile").hide();
            $("#viewContent").hide();
            $("#feedback").hide();
        }

    }
}

showChatTab = function (tabID) {
    if ($('#chatTab' + tabID).hasClass("opened")) {
        $('#chatTab' + tabID).removeClass("opened");
        $('#chatTab' + tabID).addClass("closed");
        $(".titlebar").removeClass("greenChatTitle");
    } else {
        $('#chatTab' + tabID).removeClass("closed");
        $('#chatTab' + tabID).addClass("opened");
        $(".titlebar").removeClass("greenChatTitle");
        $("#title" + tabID).addClass("greenChatTitle");
    }

}

closeChatTab = function (tabID) {
    $(".titlebar").removeClass("greenChatTitle");
    $('#chatTab' + tabID).remove();
}

videoCall = function (id) {
    var myWindow = window.open("/videocall?peer_id=" + id, "", "width=1280,height=720");
}

acceptCall = function (id) {
    socket.emit('access call', {
        peer_id: id,
        accepted: true
    });
    videoCallSoundElement.pause();
    videoCallSoundElement.currentTime = 0
    var myWindow = window.open("/videocall?peer_id=" + id, "", "width=1280,height=720");
}

rejectCall = function (id) {
    videoCallSoundElement.pause();
    videoCallSoundElement.currentTime = 0
    socket.emit('access call', {
        peer_id: id,
        accepted: false
    });
};

scrollToBottom = function (id) {
    // $("#nub"+id).animate({ scrollTop: $("#nub"+id).prop("scrollHeight")}, 1000);
    $("#nub" + id).scrollTop($("#nub" + id).prop("scrollHeight"))
}

clearSearchText = function () {
    $('#search-text-box').val("");
}

isTypingEffect = function (id, isTyping) {
    if (isTyping == true) {
        var text = $("#textTyping" + id).val();
        var dots = "";
        var i = 1;
        setTimeout(function () {
            if (i % 3 == 1) dots = ".";
            else if (i % 3 == 1) dots = "..";
            else dots = "...";
            text = text + dots;
            $("#textTyping" + id).val(text);
            i++;
            if (i == 100) i = 1;
        }, 500);
    }
}

randomCall = function () {
    var myWindow = window.open("/random-call", "", "width=1200,height=650");
}

chatFocus = function (id) {
    $(".titlebar").removeClass("greenChatTitle");
    $("#title" + id).addClass("greenChatTitle");
    $("#send" + id).focus();
}

showLoading = function () {
    $("#search-btn").attr('class', 'fa fa-spinner fa-lg fa-spin loading');
    $("#search-button").prop('disabled', true);
    $("#search-text-box").prop('disabled', true);
}

hideLoading = function () {
    $("#search-btn").attr('class', 'fa fa-search fa-lg');
    $("#search-button").prop('disabled', false);
    $("#search-text-box").prop('disabled', false);
}

playAudio = function (name) {
    var audioName = convertJptoHex(name).toUpperCase() + ".mp3";
    audioElement.setAttribute('src', 'http://data.mazii.net/audios/' + audioName);
    audioElement.play();
}

convertJptoHex = function(a) {
    if (null == a || "" == a)
        return "";
    -1 != a.indexOf("「") && (a = a.replace(new RegExp("「","g"), ""),
    a = a.replace(new RegExp("」","g"), "")),
    a = a.trim();
    for (var b = "", c = 0; c < a.length; c++)
        b += ("0000" + a.charCodeAt(c).toString(16)).substr(-4),
        c != a.length - 1 && (b += "_");
    return b;
}

showWordDetail = function(id) {
    $("#"+id).addClass("hide");
    $("#detail_"+id).removeClass("hide");
}

removeChatTab = function() {
    if ($("#chatTabs").children().length > 3) {
        $("#chatTabs").children(".chatTab:first").remove();
    }
}