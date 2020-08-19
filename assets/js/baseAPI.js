$(function () {

    // 注意：在每次调用$.get()、$.post()和$.ajax()发起请求的时候
    // 都会先调用$.ajaxPrefilter 这个函数
    // 在这个函数中我们可以得到给ajax提供的内置对象

    $.ajaxPrefilter(function (options) {
        // 在发起真正的Ajax请求之前，统一拼接请求的路径
        // console.log(options.url);
        options.url = 'http://ajax.frontend.itheima.net' + options.url;


        // 统一为有权限的接口设置请求头信息
        // 路径以my开头的才需要设置
        if (options.url.indexOf('/my/') !== -1) {
            options.headers = {
                Authorization: localStorage.getItem('token') || ''
            }
        }

        // 拦截所有响应，判断用户的身份认证信息

        // 无论请求是否成功，都会调用complete 函数
        options.complete = function (res) {
            // console.log(res);
            // 在 complete 函数中，可使用 res.responseJSON 来拿到服务器响应回来的数据
            if (res.responseJSON.status === 1 && res.responseJSON.message === '身份认证失败！') {
                // 1、强制清空token
                localStorage.removeItem('token');

                // 2、轻质跳转到登录页面
                location.href = '/login.html';
            }
        }

    });
});