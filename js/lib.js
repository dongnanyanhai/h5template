// 载入动画
function loading() {
    document.getElementById("loading");
    (function() {
        for (var a = res_imgs.split(" "), b = 0; b < a.length; b++) a[b] = res_dir + "img/" + a[b];
        var d =
            function(a, c) {
                var b = new Image;
                b.onload = function() {
                    b.onload = null;
                    c(a)
                };
                b.src = a
            },
            c = document.getElementById("loading_rate"),
            e = document.getElementById("bar"),
            f = 0;
        (function(a, b) {
            for (var c = a.length, e = 0; a.length;) d(a.shift(), function(a) {
                b(a, ++e, c)
            })
        })(a, function(a, b, d) {
            f = b / d;
            e.style.width = Math.floor(212 * f) + "px";
            c.innerHTML = Math.floor(100 * f) + "%";
            1 == f && setTimeout(function() {
                // 在这个回调函数里面，千万不要使用jQ，避免一种情况：即所有图片载入成功，但实际上JQ还没载入完成
                
                document.getElementById("loading").style.display= "none";
                // 调用音乐播放函数
                if(configs.playMuisc == true){
                    playmuisc();
                }

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
                        script.src = '//rawgit.com/mrdoob/stats.js/master/build/stats.min.js';
                        document.head.appendChild(script);
                    })()
                }
                
            }, 500)
        })
    })()
};

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
    var bValidate = RegExp(/^(0|86|17951)?(13[0-9]|15[012356789]|18[0-9]|14[57])[0-9]{8}$/).test(phone);
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