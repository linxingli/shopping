$(function(){
    var currentPage = 1;
    var pageSize = 5;
    // 将发送ajax的方法封装
    function render(){
        $.ajax({
            url:'/category/querySecondCategoryPaging',
            type:"get",
            data:{
                page:currentPage,
                pageSize:pageSize
            },
            success:function(backData){
                // 调用模板,将模板赋值给dom渲染出来
                $('tbody').html(template('tmp',backData));

                // 添加分页控件
                $("#paginator").bootstrapPaginator({
                    bootstrapMajorVersion:3,//默认是2，如果是bootstrap3版本，这个参数必填
                    currentPage:currentPage,//当前页
                    totalPages:Math.ceil(backData.total/pageSize),//总页数
                    size:"small",//设置控件的大小，mini, small, normal,large
                    onPageClicked:function(event, originalEvent, type,page){
                      //为按钮绑定点击事件 page:当前点击的按钮值
                      currentPage = page;
                        //重载页面
                        render();
                    }
                });
                  
            }
        })
    }
    render();

    // 分类按钮注册单击事件
    $('.btn_add').on('click',function(){
        // console.log("哈哈哈哈");
        // 弹出模态框
        $('#cateModal').modal('show');
        // 发送ajax请求,获取一级分类数据
        $.ajax({
            url:'/category/queryTopCategoryPaging',
            type:'get',
            data:{
                page:1,
                pageSize:999
            },
            success:function(backData){
                // console.log(backData);
                // 模板数据赋值给.dropdown-menu
                $('.dropdown-menu').html(template('tmp1',backData));
            }
        });
    });

    // 给每一个下拉框li标签注册点击事件
    $('.dropdown-menu').on('click',"a",function(){
        // console.log("哈哈哈");
        // 将text赋值给.selectText
        $('.selectText').text($(this).text());
        // 将categoryId赋值给.categoryId的val值
        $('.categoryId').val($(this).data('id'));
        //手动让brandLogo校验成功
        $form.data("bootstrapValidator").updateStatus("categoryId", "VALID");
    });

    // 上传图片的预览
    // 上传文件插件
    $("#File").fileupload({
        dataType:"json",
        //e：事件对象
        //data：图片上传后的对象，通过e.result.picAddr可以获取上传后的图片地址
        done:function (e, data) {
        //   console.log(data.result.picAddr);
        //   将放回的图片地址赋值给.preview
        $('.preview').attr('src',data.result.picAddr);
        // 同时将返回的图片地址赋值给.hideImg
        $('.hideImg').val(data.result.picAddr);

        //手动让brandLogo校验成功
        $form.data("bootstrapValidator").updateStatus("brandLogo", "VALID");
        }
    });

    // 表单校验
    var $form = $('form');    
    $form.bootstrapValidator({
        //设置不校验的内容，所有的都校验
        excluded:[],
        feedbackIcons: {
          valid: 'glyphicon glyphicon-ok',
          invalid: 'glyphicon glyphicon-remove',
          validating: 'glyphicon glyphicon-refresh'
        },
        // 规则
        fields:{
          categoryId:{
            validators:{
              notEmpty:{
                message:"请选择一级分类"
              }
            }
          },
          brandName:{
            validators:{
              notEmpty:{
                message:"请输入二级分类的名称"
              }
            }
          },
          brandLogo:{
            validators:{
              notEmpty:{
                message:"请上传图片"
              }
            }
          }
        }
    });

    // 表单验证成功事件
    $form.on('success.form.bv',function(e){
        console.log($form.serialize());

        e.preventDefault();
        // 关闭模态框
        $('#cateModal').modal('hide');
        // 发送ajax(添加分类),重载页面
        $.ajax({
            url:'/category/addSecondCategory',
            type:'post',
            data:$form.serialize(),
            success:function(data){
                // console.log(data);
                if(data.success){
                    currentPage = 1;
                    render();
                }
            }
        });
        // 重置表单样式及内容     
        $form[0].reset();
        $form.data("bootstrapValidator").resetForm();
        // 图片变回默认图片
        $('.preview').attr('src','../images/none.png')
        // .dropdown-toggle 的val变回默认
        $('.dropdown-toggle').val('请选择一级分类');
    });


});