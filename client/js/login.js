var socket;
socket = io.connect();
var usersData;
var sourceUsersStatus;
var usersStatusTemplate;
setupAjax();

$.get('/api/user/login/check-login', function (data, status) {
    if (!data.status || !data.result.login) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setupAjax()
    }
    setStatusLoginHtml();
});

$("#register").click(function () {
    if ($('#register-form').valid()) {
        registerAccount();
    }
});

$("#login").click(function () {
    if ($('#login-form').valid()) {
        login($('#username_login').val(), $('#password_login').val());
    }
});

sourceUsersStatus = $("#users-status-template").html();
usersStatusTemplate = Handlebars.compile(sourceUsersStatus);
socket.on("update status users", function (data) {
    var userLogin = JSON.parse(localStorage.getItem('user'));
    if (userLogin) {
        data.users.forEach(function (user, index) {
            if (user.username === userLogin.username) {
                data.users.splice(index, 1);
            }
        });
    }
    usersData = data;
    var listUser = usersStatusTemplate(data);
    $('#viewAside').html(listUser);
});

var sourceStatusLogin = $("#status-login-template").html();
var statusLoginTemplate = Handlebars.compile(sourceStatusLogin);

function setStatusLoginHtml() {
    var dataStorage = {
        token: localStorage.getItem('token'),
        user: JSON.parse(localStorage.getItem('user'))
    };

    if (dataStorage.user) {
        socket.emit("login", {
            username: dataStorage.user.username,
            id: dataStorage.user._id
        });
    }

    var loginStatus = statusLoginTemplate(dataStorage);
    $('#status-login').html(loginStatus);

    $('#click-register').click(function () {
        $('#tab-signIn').removeClass('active');
        $('#signIn').removeClass('active');
        $('#tab-signUp').addClass('active');
        $('#signUp').addClass('active');
    });

    $('#click-login').click(function () {
        $('#tab-signIn').addClass('active');
        $('#signIn').addClass('active');
        $('#tab-signUp').removeClass('active');
        $('#signUp').removeClass('active');
    });

    $('#click-logout').click(function () {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        socket.emit('logout');

        changeTab(0);
        $("#chatTabs").children().remove();
        $.ajaxSetup({headers: {"token": null}});
        setStatusLoginHtml();
    });

    $('#login-form').validate({
        rules: {
            username_login: {
                required: true
            },
            password_login: {
                required: true
            }
        },

        messages: {
            username_login: "Vui lòng nhập tên đăng nhập",
            password_login: "Vui lòng nhập mật khẩu"
        }
    });

    $('#register-form').validate({
        rules: {
            username_register: {
                required: true
            },
            password_register: {
                required: true,
                minlength: 2
            },
            verify_password: {
                required: true,
                minlength: 2,
                equalTo: "#password_register"
            },
            email: {
                required: true,
                email: true
            },
            full_name: {
                required: true
            },
            dob: {
                required: true,
                date: true
            },
            gender: {
                required: true
            }
        },
        messages: {
            username_register: "Vui lòng nhập tên đăng nhập",
            password_register: {
                required: "Vui lòng nhập mật khẩu",
                minlength: "Mật khẩu ít nhất 8 kí tự"
            },
            verify_password: {
                required: "Vui lòng nhập mật khẩu",
                minlength: "Mật khẩu ít nhất 8 kí tự",
                equalTo: "Mật khẩu không trùng khớp"
            },
            email: "Vui lòng nhập email",
            full_name: "Vui lòng nhập họ và tên",
            dob: "Vui lòng nhập ngày sinh",
            gender: "Vui lòng chọn giới tính"
        }
    })

}

function pressEnterRegister(event) {
    if (event.keyCode === 13 && $('#register-form').valid()) {
        registerAccount();
    }
}

function pressEnterLogin(event) {
    if (event.keyCode === 13 && $('#login-form').valid()) {
        login($('#username_login').val(), $('#password_login').val());
    }
}

function registerAccount() {
    $('#register').prop('disabled', true);
    $('#loading-register').show();
    $.post('/api/user/register',
        {
            username: $('#username_register').val(),
            password: $('#password_register').val(),
            name: $('#full_name').val(),
            email: $('#email').val(),
            gender: $('#gender').val(),
            dob: $('#dob').val(),
            imgUrl: $('#avatar-url').val()
        },
        function (data, status) {
            if (!data.status) {
                if (data.message.length) {
                    toastr.error(data.message);
                }
                else {
                    toastr.error('Đăng kí thất bại');
                }
            } else {
                $('#myModal').modal('hide');
                toastr.success('Đăng kí thành công');
                login($('#username_register').val(), $('#password_register').val())

            }
            $('#register').prop('disabled', false);
            $('#loading-register').hide();
        })
}

function login(username, password) {
    $('#login').prop('disabled', true);
    $('#loading-login').show();
    $.post('/api/user/login',
        {
            username: username,
            password: password,
        },
        function (data, status) {
            if (!data.status) {
                if (data.message.length) {
                    toastr.error(data.message);
                }
                else {
                    toastr.error('Đăng nhập thất bại.');
                }
            } else {
                $('#loginModal').modal('hide');
                localStorage.setItem('token', data.token);
                localStorage.setItem('user', JSON.stringify(data.user));
                setStatusLoginHtml();
                setUserInfo();
                toastr.success('Đăng nhập thành công');
                $.ajaxSetup({headers: {"token": localStorage.getItem("token")}});
            }
            $('#login').prop('disabled', false);
            $('#loading-login').hide();
        })
}

function setupAjax() {
    $.ajaxSetup({
        headers: {
            "token": localStorage.getItem("token")
        }
    });
}
