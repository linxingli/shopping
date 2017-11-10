
// 给所有ajax发送之前加开始进度条 ajax全局事件
$(document).ajaxStart(function(){
    NProgress.start();
});
// 给所有ajax发送结束后加结束进度条
$(document).ajaxStop(function(){
    setTimeout(function(){
        NProgress.done();
    },500);
});

// 除登录页面之外,每个页面判断当前的登录状态,如果没有登录信息的就打回login.html
var currentUrl = window.location.href;
// 检索当前的url有没有"login.html"字符串存在
if(currentUrl.indexOf('login.html')==-1){
    // 判断登录状态
    $.ajax({
        url:"/employee/checkRootLogin",
        success:function(backData){
            // 是否未登录
            if(backData.error==400){
                location.href="login.html";
            }
        }
    });
}

//分类管理切换开关
$('.child').prev().on('click',function(){
    $(this).next().slideToggle();
});

// menu按钮切换开关
$('.menu').on('click',function(){
    // 左侧栏缩小 操作类 toggleClass()
    $('.aside_left').toggleClass('now');
    // 右边同时变大  操作类 toggleClass()
    $('.main_right').toggleClass('now');
});

//logout按钮退出登录
$('.logout').on('click',function(){
    // 弹出确认框
    $('#logoutModal').modal();
    // 点击确认退出(因为on注册事件不会覆盖,所以事件嵌套时要用off()方法解绑)
    $('.btn-primary').off().on('click',function(){
        // 同时发送ajax,清除登录信息
        $.ajax({
            url:'/employee/employeeLogout',
            success:function(backData){
                // console.log(backData);
            }
        });
        // 跳回login.html
        location.href="login.html";        
    });
});