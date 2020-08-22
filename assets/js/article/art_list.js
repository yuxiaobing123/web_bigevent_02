$(function () {
    var layer = layui.layer;
    var form = layui.form;
    // 分页的
    var laypage = layui.laypage;

    // 定义美化时间的过滤器
    template.defaults.imports.dateFormat = function (date) {
        var dt = new Date(date);

        var y = dt.getFullYear();
        var m = padZero(dt.getMonth() + 1);
        var d = padZero(dt.getDate());

        var hh = padZero(dt.getHours());
        var mm = padZero(dt.getMinutes());
        var ss = padZero(dt.getSeconds());

        return y + '-' + m + '-' + d + ' ' + hh + ':' + mm + ':' + ss;
    }

    // 定义时间补零函数
    function padZero(n) {
        return n > 9 ? n : '0' + n;
    }

    // 1、先定义一个查询参数对象
    var q = {
        pagenum: 1,  //  页码值，默认显示第一页的数据
        pagesize: 2, // 每页显示几条数据  默认每页显示2条
        cate_id: '', //  文章分类的 Id
        state: ''  //  文章的发布状态，可选值有：已发布、草稿
    };

    initTable();
    initCate();

    // 初始化文章列表
    function initTable() {
        $.ajax({
            method: 'GET',
            url: '/my/article/list',
            data: q,
            success: function (res) {
                // console.log(res.total);
                if (res.status !== 0) {
                    return layer.msg('获取文章列表失败!');
                }

                var htmlStr = template('tpl-table', res)
                $('tbody').html(htmlStr);

                // 调用渲染分页的方法
                renderPage(res.total)
            }
        })
    };


    // 初始文章分类列表
    function initCate() {
        $.ajax({
            method: 'GET',
            url: '/my/article/cates',
            success: function (res) {
                if (res.status !== 0) {
                    return layer.message('获取文章分类失败！');
                }

                // 调用模板引擎渲染数据
                var htmlStr = template('tpl-cate', res);
                $('[name=cate_id]').html(htmlStr);

                // 在让layui重新渲染
                form.render();
            }
        });
    };

    // 监听筛选按钮所在表单的的提交事件
    $('#form-search').on('submit', function (e) {
        e.preventDefault();

        //    获取筛选框的值
        var cate_id = $('[name=cate_id]').val();
        var state = $('[name=state]').val();

        // 重新给查询对象赋值
        q.cate_id = cate_id;
        q.state = state;

        // 再根据新的查询对象重新渲染表格的数据
        initTable();
    });


    // 定义分页的方法
    function renderPage(total) {
        // console.log(2);
        // 调用渲染分页数据的方法
        //执行一个laypage实例
        laypage.render({
            elem: 'pageBox', //注意，这里的 test1 是 ID，不用加 # 号
            count: total, //数据总数，从服务端得到
            limit: q.pagesize, // 每页显示的条数。laypage将会借助 count 和 limit 计算出分页数。
            limits: [2, 3, 5, 10], //  每页显示多少条数据
            curr: q.pagenum,  //  
            layout: ['count', 'limit', 'prev', 'page', 'next', 'skip'],

            // 切换分页的回调函数jump
            // 触发jump回调的两种方式：
            // 1、点击页码的时候会触发jump回调
            // 2、只要调用了laypage.render()方法，也会触发jump回调
            jump: function (obj, first) {
                // console.log(obj);
                //obj包含了当前分页的所有参数，比如：

                // 把最新的页码值重新赋值给q
                q.pagenum = obj.curr;
                // 把最新的条目数也赋值给q
                q.pagesize = obj.limit;

                //首次不执行
                // 可以通过first的布尔值来判断是通过哪种方式触发的jump回调函数
                // 如果first的值为true就说明是通过第二种方式触发的
                if (!first) {
                    //do something
                    // 这就说明是通过第一种方式触发的jump回调
                    // 然后根据新的查询对象q再重新渲染表格数据
                    initTable();
                }
            }
        });
    };


    // 根据id实现删除文章的功能
    $('tbody').on('click', '.btn-delete', function () {

        // 获取当当前页面中删除按钮的个数
        var length = $('.btn-delete').length;
        console.log(length);

        // 获取文章的id
        var id = $(this).attr('data-id');
        // 弹出询问框询问用户是否要确认删除文章
        layer.confirm('确认删除?', { icon: 3, title: '提示' }, function (index) {
            // 发送ajax请求删除文章的功能
            $.ajax({
                method: 'GET',
                url: '/my/article/delete/' + id,
                success: function (res) {
                    if (res.status !== 0) {
                        return layer.msg('删除文章失败！');
                    }
                    layer.msg(res.message);

                    // 数据删除完成后需要判断当前页码值中是否还有其他的删除按钮
                    // 如果删除按钮的个数等于1的话，删除完成之后就让页码值减1，然后再调用渲染表格数据的方法
                    if (length === 1) {
                        // 如果length的值为1，就说明删除完成之后就没有剩余数据了
                        // 另外页码值最小也必须是1
                        q.pagenum = q.pagenum === 1 ? 1 : q.pagenum - 1;
                    }


                    // 另外一种写法
                    // if ($('.btn-delete').length === 1 && q.pagenum > 1) q.pagenum--;


                    // 重新渲染表格数据
                    initTable()
                    // 关闭弹出层
                    layer.close(index);
                    // 重新渲染表格数据
                    // initTable()
                }
            })


        });
    })


});