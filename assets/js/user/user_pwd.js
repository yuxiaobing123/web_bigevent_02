$(function () {

    var form = layui.form;

    form.verify({
        pwd: [/^[\S]{6,12}$/, '密码必须6到12位，且不能出现空格'],

        // 这个校验规则用来不让用户的新密码和旧密码相同
        // value值拿到的是新密码框内的值
        samePwd: function (value) {
            if (value === $("[name=oldPwd]").val()) {
                return '新旧密码不能相同！';
            }
        },

        // 下边这个校验规则用来让确认新密码和新密码的值一致
        // 这个value值拿到的是确认密码框中的值
        rePwd: function (value) {
            if (value !== $("[name=newPwd]").val()) {
                return '两次密码输入不一致！'
            }
        }
    });

    // 监听修改密码的提交操作
    $('.layui-form').on('submit', function (e) {
        e.preventDefault();

        $.ajax({
            method: 'POST',
            url: '/my/updatepwd',
            data: $(this).serialize(),
            success: function (res) {
                if (res.status !== 0) {
                    return layui.layer.msg(res.message);
                }
                layui.layer.msg('密码修改成功！');
                // 然后重置表单
                $('.layui-form')[0].reset();
            }
        })
    })


});