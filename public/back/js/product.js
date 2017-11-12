$(function(){
    var currentPage = 1;
    var pageSize  = 10;
    var $form = $('form');
    // 把分页渲染的ajax封装
    var render = function(){
        $.ajax({
            url:'/product/queryProductDetailList',
            type:'get',
            data:{
                pageSize:pageSize,
                page:currentPage
            },
            success:function(data){
                $('tbody').html(template('tmp',data));
            }
        });
    }
    render();

    // 添加商品按钮点击事件
    $('.btn_add').on('click',function(){
        // console.log("哈哈哈");
        // 弹出模态框
        $('#cateModal').modal('show');

        // 获取二级分类数据,渲染给 .dropdown-menu
        $.ajax({
            url:'/category/querySecondCategoryPaging',
            type:'get',
            data:{
                pageSize:999,
                page:1
            },
            success:function(data) {
                console.log(data);
                $('.dropdown-menu').html(template('tmp1',data));
            }
        })

    });

    //给二级分类的所有a标签添加事件
    $('.dropdown-menu').on('click','a',function(){
        // console.log("哈哈哈");
        // 将自身内容赋值给.selectText
        $('.selectText').text($(this).text());
        //获取到当前a的id，赋值给隐藏域 brandId
        $('#brandId').val($(this).data('id'));
        // 手动将brandId的表单验证状态改为成功
        $form.data("bootstrapValidator").updateStatus("brandId", "VALID");
    });

    //表单校验
    $form.bootstrapValidator({
        excluded: [],
        feedbackIcons: {
        valid: 'glyphicon glyphicon-ok',
        invalid: 'glyphicon glyphicon-remove',
        validating: 'glyphicon glyphicon-refresh'
        },
        //校验规则
        fields: {
        brandId: {
            validators: {
            notEmpty: {
                message: "请选择二级分类"
            }
            }
        },
        proName: {
            validators: {
            notEmpty: {
                message: "请输入商品名称"
            }
            }
        },
        proDesc: {
            validators: {
            notEmpty: {
                message: "请输入商品描述"
            }
            }
        },
        num: {
            validators: {
            //非空
            notEmpty: {
                message: "请输入商品库存"
            },
            //正则, 不能0开头，必须是数字
            regexp: {
                regexp: /^[1-9]\d*$/,
                message: "请输入正确的数字"
            }
            }
        },
        size: {
            validators: {
            notEmpty: {
                message: "请输入商品尺码"
            },
            regexp: {
                regexp: /^\d{2}-\d{2}$/,
                message: "请输入正确的尺码（比如：30-50）"
            }
            }
        },
        oldPrice: {
            validators: {
            notEmpty: {
                message: "请输入商品原价"
            }
            }
        },
        price: {
            validators: {
            notEmpty: {
                message: "请输入商品价格"
            }
            }
        },
        productLogo: {
            validators: {
            notEmpty: {
                message: "请上传三张图片"
            }
            }
        }
        }
    });

    // 上传文件插件
    $("#File").fileupload({
        dataType:"json",
        //e：事件对象
        //data：图片上传后的对象，通过e.result.picAddr可以获取上传后的图片地址
        done:function (e, data) {
            // 判断如果图片已经>=3,则不进行上传操作
            if($('.preview').length >= 3) return;
              console.log(data.result.picName);
            //   console.log(data.result.picAddr);
            // 把每次获取的图片地址渲染出来,追加进.imgBox
            $('.imgBox').append('<img src="'+data.result.picAddr+'" data-src="'+data.result.picAddr+'" data-picname="'+data.result.picName+'" class="preview" width="100" height="100" alt="">');
        
            // 判断当前已选图片的数量,确认是否达标
            if($('.preview').length == 3){
                // 手动设置表单验证成功
                $form.data("bootstrapValidator").updateStatus("productLogo","VALID");            
            }else{
                $form.data("bootstrapValidator").updateStatus("productLogo","INVALID");                                
            }
            // 给每个图片注册双击自杀事件
            $('.imgBox').on('dblclick','.preview',function(){
                // console.log($('.preview').length);
                $(this).remove();
                // 判断当前已选图片的数量,确认是否达标
                if($('.preview').length == 3){
                    // 手动设置表单验证成功
                    $form.data("bootstrapValidator").updateStatus("productLogo","VALID");            
                }else{
                    $form.data("bootstrapValidator").updateStatus("productLogo","INVALID");                                
                }
            });
        }
    });

    // 注册表单成功事件
    $form.on('success.form.bv',function(e){
        // 阻止表单默认跳转
        e.preventDefault();
        var data = $form.serialize();
        // 做字符串拼接,将.imgBox下的三张图片的picName和picAddr拼接进来
        // 格式:picName1=1.png&picAddr1=product/1.png
        // prop是用来获取dom属性,attr用来获取标签属性的,所以img的src属性应该由prop才能获取
        // data()自定义属性名字不能用大写 h5的属性都不能大写
        // 由于src会自动加上"http://localhost:3000"所以不能直接拼接,需要自定义属性来装src
        data+="picName1="+$('.imgBox img').eq(0).data('picname')+"&picAddr1="+$('.imgBox img').eq(0).data('src');
        data+="picName2="+$('.imgBox img').eq(1).data('picname')+"&picAddr2="+$('.imgBox img').eq(1).data('src');
        data+="picName3="+$('.imgBox img').eq(2).data('picname')+"&picAddr3="+$('.imgBox img').eq(2).data('src');
        // console.log($form.serialize());
        // 发送ajax,添加数据,重载页面
        console.log(data);
        $.ajax({
            url:'/product/addProduct',
            type:'post',
            data:data,
            success:function(backData){
                if(backData.success){
                    // 关闭模态框
                    $('#cateModal').modal('hide');
                    // 重载页面
                    currentPage = 1;
                    render();
                    // 复位模态框样式及表单内容
                    $form[0].reset();
                    $form.data("bootstrapValidator").resetForm();
                    $('.selectText').text('请选择二级分类');
                    // 图片全部清空
                    $('.preview').remove();
                }
            }
        });
    });

});