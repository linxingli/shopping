
// 给所有ajax发送之前加开始进度条 ajax全局事件
$(document).ajaxStart(function(){
    NProgress.start();
});
// 给所有ajax发送结束后加结束进度条
$(document).ajaxStop(function(){
    NProgress.done();
});

//分类管理切换开关
$('.child').prev().on('click',function(){
    $('.child').toggle();
});

// menu按钮切换开关
$('.menu').on('click',function(){
    // 左侧栏缩小 操作类 toggleClass()
    $('.aside_left').toggleClass('now');
    // 右边同时变大  操作类 toggleClass()
    $('.main_right').toggleClass('now');
});