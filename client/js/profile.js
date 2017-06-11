
    setupAjax();

    function setupAjax() {
        $.ajaxSetup({
            headers: {
                "token": localStorage.getItem("token")
            }
        });
    }

    function setUserInfo() {
        var user = JSON.parse(localStorage.getItem("user"));
        $("#profile_username").val(user.username);
        $("#profile_fullname").val(user.name);
        $("#profile_email").val(user.email);
        $("#profile_dob").val(user.dob);
        $("#profile_gender").val(user.gender);
        $("#profile_avatar-url").val(user.imgUrl);
    }

    $("#update").click(function () {
        if ($('#profile_form').valid()) {
            updateUser();
        }
    });

    function updateUser() {

        $('#update').prop('disabled', true);
        $('#loading-update').show();
        $.post('/api/user/update',
            {
                password: $('#profile_password').val(),
                name: $('#profile_fullname').val(),
                email: $('#profile_email').val(),
                gender: $('#profile_gender').val(),
                dob: $('#profile_dob').val(),
                imgUrl: $('#profile_avatar-url').val()
            },
            function (data, status) {

                if (!data.status) {
                    if (data.message.length) {
                        toastr.error(data.message);
                    }
                    else {
                        console.log(data.message);
                        toastr.error('Cập nhật thất bại');
                    }
                } else {
                    localStorage.setItem('user',JSON.stringify(data.result));
                    changeTab(0);
                    setStatusLoginHtml();
                    toastr.success('Cập nhật thành công');
                }
                $('#update').prop('disabled', false);
                $('#loading-update').hide();
            })
    };

    $('#profile_form').validate({
        rules: {
            profile_email: {
                required: true,
                email: true
            },
            profile_fullname: {
                required: true
            },
            profile_dob: {
                required: true,
                date: true
            },
            profile_gender: {
                required: true
            }
        },
        messages: {
            profile_email: "Vui lòng nhập email",
            profile_fullname: "Vui lòng nhập họ và tên",
            profile_dob: "Vui lòng nhập ngày sinh",
            profile_gender: "Vui lòng chọn giới tính"
        }
    });

    $("#update_password").click(function () {
        if ($('#password_form').valid()) {
            updatePassword();
        }
    });

    function updatePassword() {
        $('#update_password').prop('disabled', true);
        $('#loading-update-password').show();
        $.post('/api/user/updatePassword',
            {
                oldPassword: $('#old_password').val(),
                newPassword: $('#new_password').val()
            },
            function (data, status) {
                if (!data.status) {
                    if (data.message.length) {
                        toastr.error(data.message);
                    }
                    else {
                        console.log(data.message);
                        toastr.error('Cập nhật thất bại');
                    }
                } else {
                    changeTab(0);
                    toastr.success('Cập nhật thành công');
                }
                $('#update_password').prop('disabled', false);
                $('#loading-update-password').hide();
            })
    };

    $('#password_form').validate({
        rules: {
            old_password: {
                required: true,
                minlength: 8
            },
            new_password: {
                required: true,
                minlength: 8
            },
            verify_new_password: {
                required: true,
                minlength: 8,
                equalTo: "#new_password",
            }
        },
        messages: {
            old_password: {
                required: "Vui lòng nhập mật khẩu cũ",
                minlength: "Mật khẩu ít nhất 8 kí tự"
            },
            new_password: {
                required: "Vui lòng nhập mật khẩu mới",
                minlength: "Mật khẩu ít nhất 8 kí tự"
            },
            verify_new_password: {
                required: "Vui lòng nhập lại mật khẩu mới",
                minlength: "Mật khẩu ít nhất 8 kí tự",
                equalTo: "Mật khẩu không trùng khớp"
            },
        }
    });
