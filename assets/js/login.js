$(function () {

    // 点击去注册账号，注册的页面显示，登录的页面隐藏
    $("#link_reg").on("click", function () {
        $(".reg_box").show().siblings(".login_box").hide();
    });

    // 点击去登录按钮，登录的页面显示，注册的页面隐藏
    $("#link_login").on("click", function () {
        $(".login_box").show().siblings(".reg_box").hide();
    });


    // 表单的验证
    var form = layui.form;
    form.verify({
        pwd: [/^[\S]{6,12}$/, '密码必须6到12位，且不能出现空格'],

        // 校验两次密码是否一致
        // value拿到的是确认密码框中的内容
        // 然后进行一次密码框中内容是否一致的校验
        repwd: function (value) {
            var pwd = $(".reg_box [name=password]").val();
            if (value !== pwd) {
                return '两次密码不一致！';
            }
        }
    });

    // 给注册添加ajax请求
    // 监听注册表单的提交事件
    var layer = layui.layer;
    $("#form-reg").on("submit", function (e) {
        e.preventDefault();
        // 发起ajax的POST请求
        var data = {
            username: $('#form-reg [name=username]').val(),
            password: $('#form-reg [name=password]').val()
        };
        $.post(
            '/api/reguser',
            data,
            function (res) {
                console.log(res);
                if (res.status !== 0) {
                    return layer.msg(res.message);
                }
                layer.msg('注册成功，请登录！');
                // 注册完毕后，模拟点击去登录按钮跳转到登录页面
                $('#link_login').click();
                // 重置注册表单
                $('#form-reg')[0].reset();
            });
    });


    // 登录的表单验证
    $("#form-login").on("submit", function (e) {
        e.preventDefault();
        // 发起post请求
        $.post('/api/login',
            $(this).serialize(),
            function (res) {
                if (res.status !== 0) {
                    return layer.msg('登录失败！');
                }
                layer.msg('登录成功！');

                // 将登录成功返回的token字符串保存到本地存储中
                // 后边访问有权限的接口时都需要token
                localStorage.setItem('token', res.token);

                location.href = '/index.html';
            });
    });

});