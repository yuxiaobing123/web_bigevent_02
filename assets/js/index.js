$(function () {
    // 1、获取用户信息
    getUserInfo();

    var layer = layui.layer;
    // 给退出按钮添加点击事件
    $("#btnLogout").on("click", function () {
        // 点击按钮，询问用户是否确认退出
        layer.confirm('是否确认退出?', { icon: 3, title: '提示' }, function (index) {
            //do something

            // 这里是用户点击确定之后做的事情
            // 1、清空本地存储的token
            localStorage.removeItem('token');
            // 2、页面跳转到登录页面
            location.href = '/login.html';


            // 关闭弹出层
            layer.close(index);
        });
    });
});

// 获取用户信息的函数封装到入口函数之外
// 原因：让其成为一个全局的函数，后边其他页面也需要调用
function getUserInfo() {
    $.ajax({
        method: 'GET',
        url: '/my/userinfo',
        /*  headers: {
             Authorization: localStorage.getItem('token') || ''
         }, */
        success: function (res) {
            // console.log(res);
            if (res.status !== 0) {
                return layui.layer.msg('获取用户信息失败！');
            }

            // 1、调用渲染用户信息的方法
            renderInfo(res.data);
        },



    })
};


// 渲染用户的信息
function renderInfo(user) {
    // 1、获取用户名称
    // 昵称优先
    // 有昵称就显示昵称，没有昵称的话就显示用户名
    var name = user.nickname || user.username;
    $('.welcome').html('欢迎&nbsp;&nbsp;' + name);
    // 2、获取用户头像
    // 需要先判断用户是否设置了头像，如果有头像就显示头像
    // 如果没有头像就把用户的名字的第一个字符显示出来
    var url = user.user_pic;
    if (url !== null) {
        $(".layui-nav-img").attr('src', url).show();
        $(".text-avatar").hide();
    } else {
        var first = name[0].toUpperCase();
        $(".text-avatar").html(first).show();
        $(".layui-nav-img").hide();
    }
};
