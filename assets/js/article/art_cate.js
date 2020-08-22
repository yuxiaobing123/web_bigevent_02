$(function () {

    var layer = layui.layer;
    var form = layui.form;

    initArtCateList();

    // 获取文章类别的列表
    function initArtCateList() {
        // 发送ajax请求
        $.ajax({
            method: 'GET',
            url: '/my/article/cates',
            success: function (res) {
                if (res.status !== 0) {
                    return layer, msg('获取文章类别失败！');
                }

                // 利用模板引擎渲染数据
                var htmlStr = template('tpl-table', res);
                $('tbody').html(htmlStr);
            }
        })
    };

    var indexAdd = null;
    // 给添加类别按钮绑定点击事件
    $("#btnAddCate").on('click', function () {
        // 点击按钮，弹出一个页面层
        indexAdd = layer.open({
            type: 1,  //  改变弹出层的类别  
            area: ['500px', '250px'], //  设置弹出层的宽高
            title: '添加文章分类',
            content: $('#dialog-add').html()
        });
    });


    // 通过事件委托的形式给添加分类按钮绑定点击事件
    $('body').on('submit', '#form-add', function (e) {
        e.preventDefault();

        $.ajax({
            method: 'POST',
            url: '/my/article/addcates',
            data: $(this).serialize(),
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg('添加文章分类失败！');
                }
                layer.msg(res.message);
                // 然后关闭弹出层
                layer.close(indexAdd);
                // 再调用获取分类列表的函数
                initArtCateList();
            }
        })
    });


    var indexEdit = null;
    // 给添加类别按钮绑定点击事件
    $("tbody").on('click', '.btnEdit', function () {
        // 点击按钮，弹出一个页面层
        indexEdit = layer.open({
            type: 1,  //  改变弹出层的类别  
            area: ['500px', '250px'], //  设置弹出层的宽高
            title: '修改文章分类',
            content: $('#dialog-edit').html()
        });

        var id = $(this).attr('data-id');
        // console.log(id);

        $.ajax({
            method: 'GET',
            url: '/my/article/cates/' + id,
            success: function (res) {
                form.val('form-edit', res.data)
            }
        });
    });


    // 通过事件委托的形式给编辑按钮绑定点击事件
    $('body').on('submit', '#form-edit', function (e) {
        e.preventDefault();

        $.ajax({
            method: 'POST',
            url: '/my/article/updatecate',
            data: $(this).serialize(),
            success: function (res) {
                // console.log(res);
                if (res.status !== 0) {
                    return layer.msg('更新分类数据失败！');
                }

                // 再调用获取分类列表的函数
                initArtCateList();
                layer.msg('更新分类数据成功！');
                // 关闭弹出层
                layer.close(indexEdit);
            }
        });
    });

    // 删除分类
    $('tbody').on('click', '.btnDelete', function () {
        var id = $(this).attr('data-id');

        // 弹出层，提示用户是否确认删除
        layer.confirm('确认删除?', { icon: 3, title: '提示' }, function (index) {

            $.ajax({
                method: 'GET',
                url: '/my/article/deletecate/' + id,
                success: function (res) {
                    if (res.status !== 0) {
                        return layer.msg('删除文章分类失败！')
                    }
                    layer.msg(res.message);
                    // 再调用获取分类列表的函数
                    initArtCateList();
                    // 关闭提示删除层
                    layer.close(index);
                }

            });
        });


    });


});