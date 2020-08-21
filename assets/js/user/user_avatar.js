$(function () {

    var layer = layui.layer;

    // 1.1 获取裁剪区域的 DOM 元素
    var $image = $('#image')
    // 1.2 配置选项
    const options = {
        // 纵横比
        aspectRatio: 1,
        // 指定预览区域
        preview: '.img-preview'
    }

    // 1.3 创建裁剪区域
    $image.cropper(options)



    // 给上传文件的按钮绑定点击事件
    $("#btnChooseImage").on("click", function () {
        $("#file").click();
    });

    // 给文件选择框绑定change事件
    $('#file').on('change', function (e) {
        //    console.log(e); 

        var filelist = e.target.files;
        if (filelist.length === 0) {
            return layer.msg('请选择图片！');
        }

        // 1、获取用户选择的文件
        // e.target 等价于 this
        var file = e.target.files[0];
        // 2、 将图片转换成路径
        var imgURL = URL.createObjectURL(file);
        // 3、重新初始化裁剪区域
        // 先销毁旧的裁剪区域，然后重新设置图片路径，之后再创建一个新的裁剪区域
        $image
            .cropper('destroy') // 销毁旧的裁剪区域
            .attr('src', imgURL) // 重新设置图片路径
            .cropper(options)    // 重新初始化裁剪区域
    });

    // 为确定按钮绑定点击事件
    $("#btnUpload").on("click", function () {
        // 1、先拿到用户裁剪之后的图片
        var dataURL = $image
            .cropper('getCroppedCanvas', {
                // 创建一个 Canvas 画布
                width: 100,
                height: 100
            })
            .toDataURL('image/png')

        // 2、发送ajax请求将图片上传到服务器
        $.ajax({
            method: 'POST',
            url: '/my/update/avatar',
            data: {
                avatar: dataURL
            },
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg('头像上传失败！');
                }

                layer.msg('头像上传成功！');
                // 然后调用父窗口的更新用户信息的方法更新用户的头像
                window.parent.getUserInfo();
            }

        });
    });

});