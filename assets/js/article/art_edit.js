$(function () {

    // 设置编辑的表单信息
    // 用等号切割，然后使用后面的id值
    // console.log(location);
    // alert(location.search.split('=')[1]);
    // 定义初始化编辑页面的函数
    function initForm() {
        var id = location.search.split('=')[1];
        // 发送ajax给表单赋值
        $.ajax({
            method: 'GET',
            url: '/my/article/' + id,
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg(res.message);
                }
                // 把值渲染到表格当中
                form.val('form-edit', res.data);
                // 给富文本编辑器赋值
                tinyMCE.activeEditor.setContent(res.data.content);

                // 设置文章封面
                if (!res.data.cover_img) {
                    return layer.msg('用户未曾上传头像！');
                }
                var newImgURL = baseURL + res.data.cover_img;
                $image
                    .cropper('destroy')      // 销毁旧的裁剪区域
                    .attr('src', newImgURL)  // 重新设置图片路径
                    .cropper(options)        // 重新初始化裁剪区域
            }
        })
    }



    var layer = layui.layer;
    var form = layui.form;

    initCate();
    // 定义加载文章分类的方法
    function initCate() {
        $.ajax({
            method: 'GET',
            url: '/my/article/cates',
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg('获取文章分类失败！');
                }

                var htmlStr = template('tpl-cate', res);
                $('[name=cate_id]').html(htmlStr);

                // 然后再重新渲染form表单
                form.render();

                // 文章分类渲染完毕之后再调用初始化form的方法
                initForm();
            }
        })
    }


    // 初始化富文本编辑器
    initEditor();


    // 1. 初始化图片裁剪器
    var $image = $('#image')

    // 2. 裁剪选项
    var options = {
        aspectRatio: 400 / 280,
        preview: '.img-preview'
    }

    // 3. 初始化裁剪区域
    $image.cropper(options)

    // 选择文章封面实现更换封面的功能
    $(".btnChooseImage").on('click', function () {
        $('#file').click();
    });

    // 监听隐藏的input文件选择框的change事件
    $('#file').on('change', function (e) {
        // 先拿到用户选择的文件
        var fileList = e.target.files;
        if (fileList.length === 0) {
            return;
        }

        // 接下来就是更换图片
        // 1、先拿到用户选择的图片文件
        var file = e.target.files[0];
        // 2、根据新的图片创建一个新的URL地址
        var newImgURL = URL.createObjectURL(file);
        // 3、先销毁旧的裁剪区域，再设置新的图片路径，之后再创建一个新的裁剪区域
        $image
            .cropper('destroy')      // 销毁旧的裁剪区域
            .attr('src', newImgURL)  // 重新设置图片路径
            .cropper(options)        // 重新初始化裁剪区域

    });

    // 定义文章的发布状态
    var art_state = '已发布';
    // 如果点击的是存为草稿按钮，则文章的状态就是存为草稿、
    // 默认的就是已发布状态
    $('#btnSave2').on('click', function () {
        art_state = '存为草稿';
    });

    // 发布新文章
    // 由于此接口涉及到文件上传的功能，因此提交的请求体，必须是 FormData 格式！
    // 基于form表单创建FormData对象
    // 为表单绑定提交事件
    $('#form-pub').on('submit', function (e) {
        //1、 阻止表单的默认提交行为
        e.preventDefault();
        // 2、创建FormData对象
        // var fd = new FormData($(this)[0]);
        var fd = new FormData(this);
        // 3、将文章的发布状态追加到FormData对象中
        fd.append('state', art_state);
        // 4、将封面裁剪后的图片输出为文件
        $image
            .cropper('getCroppedCanvas', { // 创建一个 Canvas 画布
                width: 400,
                height: 280
            })
            .toBlob(function (blob) {
                // 将 Canvas 画布上的内容，转化为文件对象
                // 得到文件对象后，进行后续的操作
                // 5、将文件对象添加到FormData对象中
                fd.append('cover_img', blob);
                publisherArticle(fd);
            })
        // console.log(fd);
        /* fd.forEach(function (value, key) {
            console.log(key, value);
        }) */
    });

    // 定义发布文章的方法
    function publisherArticle(fd) {
        // 发送ajax请求实现发布文章的功能
        $.ajax({
            method: 'POST',
            url: '/my/article/edit',
            data: fd,
            // 利用FormData格式上传数据必须设置以下两个属性、
            contentType: false,
            processData: false,
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg('文章发布失败！');
                }
                layer.msg(res.message);
                /* window.parent.$('.two').addClass('layui-this').siblings().removeClass('layui-this'); */
                // window.parent.document.getElementById('#art_list').click();
                // 文章发布成功后跳转到文章列表的页面
                location.href = '/article/art_list.html';
            }

        })
    }


});