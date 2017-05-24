// Timer动画示例
var p1_timer = 0;
function page1_init(){
    // 避免多次执行
    var i = 1;
    var temp_fun = function(){
        $("#p1-mid").attr('src', res_dir + 'img/p1-mid-' + i + '.png');
        i = i + 1;
        if(i > 4){
            i = 1;
        }
        p1_timer = setTimeout(temp_fun,300);
    }
    p1_timer = setTimeout(temp_fun,300);
}
// 停止动画：
// clearTimeout(p1_timer);


$(document).ready(function() {
    
    // 处理ios中标签无法触发click事件的问题
    FastClick.attach(document.body);

    // if(/ip(hone|od)|ipad/i.test(navigator.userAgent)) {
    //     $("body").css("cursor", "pointer");
    // }


    // 事件模版
    $("body").on('click', '#pageX', function(event) {
        event.preventDefault();

        var $this = $(this);

        if($this.data('clk') == undefined || $this.data('clk') == "reclick"){
            $this.data('clk','clicked');
            // $this.data('clk','reclick');
            // 提交数据到后台
            $.ajax({
                type: 'POST',
                url: ajax_url + 'main/set_inviter',
                data: $("#takepart-top-form").serialize(),
                success: function(json){
                    //判断返回值不是 json 格式
                    if (!json.match("^\{(.+:.+,*){1,}\}$")){
                        //普通字符串处理
                        $.toast('网络问题，暂时无法连接服务器','text');
                    }else{
                        //通过这种方法可将字符串转换为对象
                        var remsg = jQuery.parseJSON(json);
                        if(remsg.status == 1){
                            // 成功
                            $.toast(remsg.msg,'text');
                        }else{
                            // 失败
                            $.toast(remsg.msg,'text');
                        }
                    }
                    // 收到服务器反馈后，允许再次点击
                    $this.data('clk','reclick');
                }
            });
        }
    });

    // 触摸事件-end
    $("body").on('click', '#pageX', function(event) {
        event.preventDefault();
        
        var $this = $(this);
        // 避免连续点击触发两次事件
        if($this.data('clk') == undefined || $this.data('clk') == "reclick"){
            $this.data('clk','clicked');
            // $this.data('clk','reclick');
        }
    });

    // 页面载入完成时，来一波
    $(window).on('load',function () {
        $.auto_size(".autosize");
    });

    $(window).on('resize',function () {
        $.auto_size(".autosize");
    });

    // Swiper 启用
    if(configs.useSwiper == true){
        window.mySwiper = new Swiper ('.swiper-container', {
            // Optional parameters
            // direction: 'vertical',
            initialSlide :2,
            effect : 'fade',
            loop: false,
            onSlideChangeEnd: function(){
                // mySwiper.lockSwipes();
                // mySwiper.unlockSwipes();
                // mySwiper.slideNext();
                var num = parseInt($(".swiper-slide-active").attr("data-num"));
                switch (num) {
                    case 1:
                        page1_init();
                        break;
                }
                // 把num传递过去纯粹是方便以后使用，目前来说有点多余
                $.do_animate(num);
            },
            onInit: function(swiper){
                // 锁定切换
                // swiper.lockSwipes();
                // 取消锁定
                // mySwiper.unlockSwipes();
                // 禁止触摸控制
                // mySwiper.disableTouchControl();
                // 允许触摸控制
                // mySwiper.enableTouchControl();
                // 如果css里面没有手动设定动画对象的opacity为0，就在这里一次性搞定
                $(".swiper-slide .ani").css('opacity', '0');
                // 如果使用Swiper，则要在初始化后才调用auto_size，避免初始化未完成就auto_size
                $.auto_size(".autosize");
            },
            onTouchEnd:function(){
                // var num = parseInt($(".swiper-slide-active").attr("data-num"));
            }
        });
    }
});