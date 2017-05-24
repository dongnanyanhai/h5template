// 通过给html标签加“data-use-rem”，可以调用下面函数
(function(win) {
    var doc = win.document,
        html = doc.documentElement,
        option = html.getAttribute('data-use-rem');
    if (option === null) return;
    var baseWidth = parseInt(option).toString() == 'NaN' ? 750 : parseInt(option),
        resizeEvt = 'orientationchange' in win ? 'orientationchange' : 'resize',
        recalc = function() {
            var clientWidth = html.clientWidth || 375;
            html.style.fontSize = 100 * clientWidth / baseWidth + 'px';
        };
    if (!doc.addEventListener) return;
    win.addEventListener(resizeEvt, recalc, false);
    doc.addEventListener('DOMContentLoaded', recalc, false);
})(window);

function loading(imgs,img_dir,done_callback,all_done_callback){

    // 重写
    var loading_rate = 0;

    for (var all_img = imgs.split(" "), i = 0; i < all_img.length; i++) {
        // 组成图片完整地址
        all_img[i] = img_dir + all_img[i];
    }

    var img_load_fun = function(img_src,img_callback){
        var temp_img = new Image;
        temp_img.onload = function(){
            temp_img.onload = null;
            img_callback(img_src);
        }
        temp_img.src = img_src;
    }

    // 循环遍历所有图片
    var temp_fun_o = function(all_img,temp_fun_t){
        for (var imgs_len = all_img.length, imgs_done_num = 0; all_img.length;) {
            img_load_fun(all_img.shift(),function(img_src){
                temp_fun_t(img_src,++imgs_done_num,imgs_len);
            });
        }
    }

    // 检测图片载入进度
    var temp_fun_t = function(img_src,imgs_done_num,imgs_len){

        loading_rate = imgs_done_num / imgs_len;

        done_callback(loading_rate);

        if(1 == loading_rate){

            setTimeout(function(){

                // 所有图片载入完成

                // 调用音乐播放函数
                if(configs.playMuisc == true){
                    document.getElementById("music-btn").style.display= "block";
                    playmuisc();
                }else{
                    document.getElementById("music-btn").style.display= "none";
                }

                // 性能检测面板
                if(configs.showStats == true){
                    (function() {
                        var script = document.createElement('script');
                        script.onload = function() {
                            var stats = new Stats();
                            document.body.appendChild(stats.dom);
                            requestAnimationFrame(function loop() {
                                stats.update();
                                requestAnimationFrame(loop)
                            });
                        };
                        // script.src = '//rawgit.com/mrdoob/stats.js/master/build/stats.min.js';
                        script.src = res_dir + "js/stats.min.js";
                        document.head.appendChild(script);
                    })()
                }

                // 手机调试面板
                if(configs.showEruda == true){
                    ;(function() {
                        var script = document.createElement('script');
                        document.body.appendChild(script);
                        script.onload = function(){
                            eruda.init()
                        }
                        // script.src = "//liriliri.github.io/eruda/eruda.min.js";
                        script.src = res_dir + "js/eruda.min.js";
                    })();
                }

                document.getElementById("loading").style.display= "none";

                // 执行回调函数
                all_done_callback();
            },500);
        }
    }

    // 开始执行——我痛恨这样的Javascript
    temp_fun_o(all_img,temp_fun_t);
}

// 播放音乐
function playmuisc(){
    var url = res_dir + "img/music.mp3";
    window.audio = document.createElement('audio');
    var source = document.createElement('source');
    audio.name = "audio";
    source.type = "audio/mpeg";
    source.src = url;
    source.autoplay = "autoplay";
    // audio.loop = "true";
    audio.addEventListener('ended', function() {
        setTimeout(function() {
            audio.play();
        }, 500);
    }, false)
    audio.appendChild(source);
    audio.play();
    var fristTouch = false;
    $("#music-btn").on("touchstart", function() {
        if (audio.paused) {
            audio.play();
            $("#music-btn").addClass('circle').removeClass('stop');
        } else {
            audio.pause();
            $("#music-btn").removeClass('circle').addClass('stop');
        }
    });
}

// 判断是否在微信内打开
function is_weixn(){
    var ua = navigator.userAgent.toLowerCase();
    if(ua.match(/MicroMessenger/i)=="micromessenger") {
        return true;
    } else {
        return false;
    }
}

// 判断是否为手机号码
function is_phone(phone){
    var bValidate = RegExp(/^1(3|4|5|7|8)[0-9]\d{8}$/).test(phone);
    if(bValidate){
        return true;
    }else{
        return false;
    }
}

// 生成给定概率的随机对象

/* test
var a = ['一等奖：宝马X6', '二等奖：苹果三件套', '三等奖：威戈背包', '继续努力！'];
var b = [100, 100, 100, 100];
console.log(goodluck(a, b));
*/
function goodluck(obj, luck) {
    var sum = 0,
        factor = 0,
        random = Math.random();

    for (var i = luck.length - 1; i >= 0; i--) {
        sum += luck[i]; // 统计概率总和
    };
    random *= sum; // 生成概率随机数
    for (var i = luck.length - 1; i >= 0; i--) {
        factor += luck[i];
        if (random <= factor) return obj[i];
    };
    return null;
};

// 生成start到end之间的整数
function rnd(start, end){
    return Math.floor(Math.random() * (end - start) + start);
}

// JQuery 扩展
// 自动调整宽高
;(function($){
    $.extend({
        // 自动适应页面
        // 调用方式：data-w表示宽比例，data-h表示高比例，设定data-width或者data-height，都会使标签根据父节点的高度重新计算自身宽度
        // <div class="p-contents autosize" data-w="640" data-h="1008" data-left="center">
        //     <div id="p5-container" class="p-container autosize" data-w="640" data-h="767" data-width="1">
        //     </div>
        // </div>
        auto_size: function (selectid){
            // var win_w = $(window).width();
            // var win_h = $(window).height();
            $(selectid).each(function(index, el) {
                
                var $el = $(el);
                var $par = $el.parent();
                var $p_w = $par.width();
                var $p_h = $par.height();

                var el_w = parseInt($el.data('w'));
                var el_h = parseInt($el.data('h'));

                if(!isNaN(el_w) && !isNaN(el_h)){

                    var wh_per = el_w/el_h;

                    if($p_w/$p_h > wh_per){
                        // 比例不对
                        // 高度不变，更新宽度
                        $el.height($p_h);
                        var new_w = $p_h * wh_per;
                        $el.width(new_w);                
                    }else{
                        // 比例不对
                        // 宽度不变，更新高度
                        $el.width($p_w);
                        var new_h = $p_w / wh_per;
                        $el.height(new_h);
                    }

                    if($el.data('width') != undefined){
                        var width = $p_w * $el.data('width');
                        $el.css('width', width + 'px');
                        var new_h = width/wh_per;
                        $el.height(new_h);
                    }

                    if($el.data('height') != undefined){
                        // 这里的height应该根据宽高比例来计算，不应该直接乘以页面高度
                        // 上下两个代码可以合并
                        var height = $p_h * $el.data('height');
                        $el.css('height', height + 'px');
                        var new_w = height * wh_per;
                        $el.width(new_w);
                    }
                }

                


                if($el.data('top') != undefined){
                    if($el.data('top') == 'middle'){
                        // 垂直居中
                        var top = ($p_h-$el.height())/2;
                        $el.css('top', top + 'px');
                    }else{
                        var top = $p_h * $el.data('top');
                        $el.css('top', top + 'px');
                    }
                    
                }
                if($el.data('left') != undefined){
                    if($el.data('left') == 'center'){
                        // 水平居中
                        var left = ($p_w-$el.width())/2;
                        $el.css('left', left + 'px');
                    }else{
                        var left = $p_w * $el.data('left');
                        $el.css('left', left + 'px');
                    }
                    
                }

                if($el.data('size') != undefined){
                    var fontsize = parseInt($p_h * $el.data('size'));
                    $el.css('font-size', fontsize + 'px');
                }

                if($el.data('lineheight') != undefined){
                    var lineheight = $p_h * $el.data('lineheight');
                    $el.css('line-height', lineheight + 'px');
                }
            });
        },

        // 自动处理动画
        // 调用方式：在每个需要进行动画展示的标签内添加：
        //  class="ani" data-animate="bounceInLeft" data-animate-duration="1s" data-animate-delay="0.2s"
        do_animate:function (page){

            // 清理其他页面的动画设定
            $(".swiper-slide .isanimate").each(function(index, el) {
                var $el = $(el);
                var animate = $el.data('animate');
                $el.removeClass(animate).removeClass('isanimate').css('opacity', '0');;
            });

            // 对当前页面的所有动画效果进行设定
            $(".swiper-slide-active .ani").each(function(index, el) {
                var $el = $(el);
                var duration = $el.data('animate-duration');
                var delay = $el.data('animate-delay');
                var animate = $el.data('animate');
                $el.css({
                    'opacity':'1',
                    'animation-duration': duration,
                    '-webkit-animation-duration': duration,
                    'animation-delay':delay,
                    '-webkit-animation-delay':delay
                }).addClass(animate).addClass('isanimate');
            });
        },

        // 其他方法
        // 测试
        justtest:function(a){
            console.log(a);
        },
    });
    
})(jQuery);
