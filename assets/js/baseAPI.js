$(function () {

    // 注意：在每次调用$.get()、$.post()和$.ajax()发起请求的时候
    // 都会先调用$.ajaxPrefilter 这个函数
    // 在这个函数中我们可以得到给ajax提供的内置对象

    $.ajaxPrefilter(function (options) {
        // 在发起真正的Ajax请求之前，统一拼接请求的路径
        // console.log(options.url);
        options.url = 'http://ajax.frontend.itheima.net' + options.url;
    });



});