$(function(){
    // 把获取数据渲染页面的ajax封装成一个函数
    var pageCurrent = 1;
    var pageSize = 5;
    function render(){
        $.ajax({
            url:'/category/queryTopCategoryPaging',
            type:'get',
            data:{
                page:pageCurrent,
                pageSize:pageSize
            },
            success:function(backData){
                // 将模板数据赋值给dom
                $('tbody').html(template('tmp',backData));
                // console.log(Math.ceil(backData.total/pageSize));
                
                // 添加分页控件
                $("#paginator").bootstrapPaginator({
                    bootstrapMajorVersion:3,//默认是2，如果是bootstrap3版本，这个参数必填
                    currentPage:pageCurrent,//当前页
                    totalPages:Math.ceil(backData.total/pageSize),//总页数
                    size:"small",//设置控件的大小，mini, small, normal,large
                    onPageClicked:function(event,originalEvent,type,page){
                      //为按钮绑定点击事件 page:当前点击的按钮值传递给pageCurrent变量
                      pageCurrent = page;
                      render();
                    }
                });                  
            }
        });
    } 
    render();    
    // 点击添加分类按钮,弹出模态框
    $('.btn_add').on('click',function(){
        // 弹出模态框        
        $('#addModal').modal('show');
        // // 点击确定按钮 
        // $('.btn_sure').off().on('click',function(e){
        //     // 阻止表单的默认跳转行为
        //     e.preventDefault();
        //     // 关闭模态框
        //     // 发送ajax请求(添加数据),渲染页面
        // })
    });

    // 表单校验
    var $form = $('form');
    $form.bootstrapValidator({
        //小图标
        feedbackIcons: {
            valid: 'glyphicon glyphicon-ok',
            invalid: 'glyphicon glyphicon-remove',
            validating: 'glyphicon glyphicon-refresh'
        },
        //校验规则
        fields:{
            // 给categoryName属性设置的校验规则
            categoryName:{  
                validators:{
                    //非空
                    notEmpty:{
                        message:"请输入一级分类"
                    }
                }  
            }
        }
    });

    // 注册校验成功事件
    $form.on('success.form.bv',function(e){
        // 阻止表单的默认跳转
        e.preventDefault();
        // 隐藏模态框
        $('#addModal').modal('hide');        
        // 发送ajax.添加数据,渲染页面
        $.ajax({
            url:'/category/addTopCategory',
            type:'post',
            data:$form.serialize(),
            success:function(backData){
                // console.log(backData);
                if(backData.success){
                    // 重置模态框的样式及清空内容
                    $form.data("bootstrapValidator").resetForm();
                    $form[0].reset();
                    // 重载页面
                    render();
                }
            }
        });
        $form[0].reset();
        $form.data("bootstrapValidator").resetForm();
    })


});