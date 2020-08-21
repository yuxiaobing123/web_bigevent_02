$(function () {

    var form = layui.form;


    form.verify({
        nickname: function (value) {
            if (value.length > 6) {
                return '昵称长度在1~6个字符之间！';
            }
        }
    });

    initUserInfo()
    // 将用户信息渲染到页面
    function initUserInfo() {
        $.ajax({
            method: 'GET',
            url: '/my/userinfo',
            success: function (res) {
                if (res.status !== 0) {
                    return layui.layer.msg(res.message);
                }

                // 利用layui的lay-filter 快速给表单赋值
                form.val("formUserInfo", res.data);


            }
        })
    };


    // 点击重置按钮，取消对表单的修改、
    $("#btnReset").on('click', function (e) {
        // 先阻止默认的全部清空的行为
        e.preventDefault();

        // 再重新渲染页面
        initUserInfo();
    })


    // 监听表单的提交事件
    $('.layui-form').on('submit', function (e) {
        e.preventDefault();

        $.ajax({
            method: 'POST',
            url: '/my/userinfo',
            data: $(this).serialize(),
            success: function (res) {
                if (res.status !== 0) {
                    return layui.layer.msg('更新用户信息失败！');
                }

                layui.layer.msg(res.message)

                // 调用父窗口的渲染用户信息的方法
                // index.js中的全局方法
                window.parent.getUserInfo();
            }
        })
    })


});