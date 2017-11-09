// login页面的js
$(function(){

    // 表单验证插件
    // 1.用户名不为空
    // 2.密码不为空
    // 3.密码长度6-12

    // 获取表单元素
    var $form = $('form');

    // 调用bootstrapValidator,校验表单
    $form.bootstrapValidator({
        // 配置校验时的小图标
        feedbackIcons: {
            valid: 'glyphicon glyphicon-ok',
            invalid: 'glyphicon glyphicon-remove',
            validating: 'glyphicon glyphicon-refresh'
          },
        // 规则
        fields: {
            //用户名-对应了表单中的username属性
            username:{
                // username对应的所有校验规则
                validators: {
                    notEmpty: {
                      message: "用户名不能为空"
                    },
                    callback:{
                      message:"用户名错误"
                    }
                  }
            },
            // 密码-对应了表单中的password属性
            password:{
                //password对应的所有校验规则
                validators: {
                    notEmpty: {
                      message: "用户名不能为空"
                    },
                    callback:{
                      message:"密码错误"
                    },
                    stringLength:{
                        min:6,
                        max:12,
                        message:"密码长度是6-12位"                      
                    }
                  }
            }
        }  
    });

    // 在提交表单之前,发送ajax进行验证 
    //给表单注册一个校验成功事件 success.form.bv
    $form.on('success.form.bv',function(e){
        // 阻止表单提交按钮的默认跳转行为
        e.preventDefault();
        // 发送ajax
        $.ajax({
            url:'/employee/employeeLogin',
            type:'post',
            // serialize()方法
            data:$form.serialize(),
            success:function(backData){
                // console.log(backData);
                // 根据返回的数据做判断处理
                if(backData.success){
                    // 登录成功
                    location.href = "index.html";                    
                }
                if(backData.error===1000){
                    // alert('用户名不存在');
                    // 将提示信息放置表单输入框下面
                    //使用updateStatus方法，主动把username这个字段变成校验失败
                    //第一个参数：字段名  表单中的name属性
                    //第二个参数：INVALID :校验失败
                    //第三个参数：配置提示消息
                    $form.data("bootstrapValidator").updateStatus("username", "INVALID", "callback");
                }
                if(backData.error===1001){
                    // alert('密码不存在');
                    $form.data("bootstrapValidator").updateStatus("password", "INVALID", "callback");                 
                }
            }
        })        
    })

    // 重置按钮点击事件
    $('[type=reset]').on('click',function(){
        // 重置表单
        //获取到bootstrapValidator实例，调用resetForm方法
        $form.data("bootstrapValidator").resetForm();
    });


});