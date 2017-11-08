
// 给所有ajax发送之前加开始进度条 ajax全局事件
$(document).ajaxStart(function(){
    NProgress.start();
});
// 给所有ajax发送结束后加结束进度条
$(document).ajaxStop(function(){
    NProgress.done();
});