// ajax获取数据,渲染页面
$(function(){
    // 当前页数
    var currentPage = 1;
    // 一页的数据量
    var pageSize = 5;

    // 把ajax请求数据,渲染页面的方法封装起来
    function Render(){
        $.ajax({
            url:'/user/queryUser',
            type:'get',
            data:{
                page:currentPage,
                pageSize:pageSize
            },
            success:function(backData){
                // console.log(backData);
                
                //调用模板
                var html = template('tmp',backData);
                // 将模板数据赋值给dom元素
                $('tbody').html(html);    

                // 分页插件的初始化
                $("#paginator").bootstrapPaginator({                    
                    bootstrapMajorVersion:3,//默认是2，如果是bootstrap3版本，这个参数必填
                    currentPage:currentPage,//当前页
                    totalPages:Math.ceil(backData.total/pageSize),//总页数
                    size:"small",//设置控件的大小，mini, small, normal,large
                    onPageClicked:function(event, originalEvent, type,page){
                        //为按钮绑定点击事件 page:当前点击的按钮值
                        currentPage = page;
                        //切换页面后重新渲染页面
                        Render();
                    }
                });   
            }
        });
    }   
    Render();

    // 给禁用启用按钮添加事件
    $('tbody').on('click','.btn',function(){
        var that = $(this);
        // 弹出模态框
        $('#disableModal').modal('show');
        // 确定按钮'#disableModal'
        $('.disableModal_sure').off().on('click',function(){
            console.log(that);
            // 隐藏模态框
            $('#disableModal').modal('hide');        
            // 获取当前按钮的id 更改isDelete状态
            var id = that.parent('td').data('id');
            // 获取data自定属性时,只需要写"data-"后面的字段即可
            var isDelete  = that.hasClass('btn-danger')?0:1;
            // 发送ajax update数据,重新渲染页面
            $.ajax({
                url:'/user/updateUser',
                type:'post',
                data:{
                    id:id,
                    isDelete:isDelete
                },
                success:function(backData){
                    // console.log(backData);
                    if(backData.success){
                        // 重新渲染页面
                        Render();
                    }
                }
            });
            });
    });


})