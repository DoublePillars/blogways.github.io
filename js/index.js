$(function () {
    //选择分类
    $.getJSON("/categorycount.json",function(o){
        $.each( o, function( i , item ){
            var content = "<li><span class='category'>"+item[1]+"</span><span class='pull-right check'>√</span></li>";
            $(".sort > .select > ul").append(content);
        });
    });
    //点击下拉框，展开下拉列表，给下拉框添加一个描边效果
    $(".select").click(function() {
        $(this).toggleClass('open');
    });
    //点击下拉列表的选项，将选项中的值填入下拉框中
    $(".select > ul").delegate('li','click',function() {
        $(this).parent().prev().text($(this).children('span:first-child').text());
    });
    //初始显示博文，返回博文数
    var num = initialBlog();
    //浏览器窗口发生变化时，根据窗口宽度确定显示博文数
    window.onresize = function(){
        initialBlog();
    };
    //根据条件筛选博文的下拉框里的内容发生改变时，重新调用显示博文的函数
    $(".select > span").bind('DOMNodeInserted',function () {
        initialBlog();
    });
    //当滚动条滑到底部时，增加显示的博文数。
    var winH = $(window).height();
    $(window).scroll(function() {
        var pageH = $(document.body).height();
        var scrollT = $(window).scrollTop();
        var aa = (pageH - winH - scrollT)/winH;
        if( aa < 0.02 ){
            if($(window).width() <= 992){
                num += 8;
            }else{
                num += 9;
            } 
            showBlog(num);
        }
    });
    //主页面博文悬浮效果
    $(".blog").hover(function(){
        $(this).children(".divider-line").children("img").attr('src','/images/circle-blue.png');
        $(this).children(".post_info").css('background-color','rgb(251,251,251)');
        $(this).children(".post_scan").css('background-color','rgb(251,251,251)');
    },function(){
        $(this).children(".divider-line").children("img").attr('src','/images/circle-black.png');
        $(this).children(".post_info").css('background-color','#fff');
        $(this).children(".post_scan").css('background-color','#fff');
    });
    //分类列表
    $.getJSON("/categorycount.json",function(o){
        $.each( o, function( i , item ){
            var content =
            "<a class='list-group-item' href='/categories/"+item[0]+"/'>"
            +item[1]+"<span class='badge pull-right'>"+item[2]+
            "</span><div class='inset-line'></div></a>";
            $("#categorybar-list").append(content);
        });
    });
    //人气博主
    $.getJSON("/authors.json",function(o){
        o.sort(by("articles"));
        $.each( o, function( i , item ){
            var content =
            "<a class='list-group-item' href='"+item.path+"' style='color:#24292c;'>"+
            item.name+"<span class='pull-right badge'>"+item.articles.length+
            "</span><div class='inset-line'></div></a>";
            $("#my-like").append(content);
            if(i === 7){
              return false;
            }
        });
    });
    //离开时关闭下拉框
    $(".select").hover(function(){
    },function(){
        $(this).removeClass('open');
    })
    //子元素滚动，父元素不滚动
    $(".wheel").scrollUnique();
});
//屏幕小于等于992px时，最开始显示8篇博文，否则显示9篇
function initialBlog(){
    var num = 0;
    if($(window).width() <= 992){
        num = 8;
    }else{
        num = 9;
    } 
    showBlog(num);
    return num;
}
//传入需要在首页展示的博客数量，然后展示。
function showBlog(num) {
    var count = 0;
    var type = $(".sort > .select > span").text();
    var time = $(".time > .select > span").text().substring(0,4);
    $('.blog').hide();
    var kinds = $(".kind > a");
    var times = $(".post_title > h4 > a");
    for(var i=0;i<kinds.length;i++) {
        var year = times.eq(i).attr('href').split('/')[2];
        if (type === "ALL" || type === kinds[i].innerHTML.trim()) {
            if(time === year){
                $(times[i]).parents('.blog').show();
                count++;
            }else if(time === "ALL"){
                $(times[i]).parents('.blog').show();
                count++;
            }
        }
        if(count >= num){
            return;
        }
        if(i == kinds.length-1){
            $(".footer").text('已全部加载完成');
        }else{
            $(".footer").text('向下滑动加载更多...');
        }
    }
    if(count == 0){
        $(".footer").text('对不起，无符合的内容');
    }
}
//人气博主排序规则
function by(articles){
    return function(o, p){
      var a, b;
      if (typeof o === "object" && typeof p === "object" && o && p) {
          a = o[articles].length;
          b = p[articles].length;
          if (a === b) {
              return 0;
          }
          if (typeof a === typeof b) {
              return a > b ? -1 : 1;
          }
          return typeof a > typeof b ? -1 : 1;
      }
      else {
          throw ("error");
      }
    }
};
//子元素滚动，父元素不滚动的函数
$.fn.scrollUnique = function() {
    return $(this).each(function() {
        var eventType = 'mousewheel';
        // 火狐是DOMMouseScroll事件
        if (document.mozHidden !== undefined) {
            eventType = 'DOMMouseScroll';
        }
        $(this).on(eventType, function(event) {
            // 一些数据
            var scrollTop = this.scrollTop,
                scrollHeight = this.scrollHeight,
                height = this.clientHeight;
            var delta = (event.originalEvent.wheelDelta) ? event.originalEvent.wheelDelta : -(event.originalEvent.detail || 0);        
            if ((delta > 0 && scrollTop <= delta) || (delta < 0 && scrollHeight - height - scrollTop <= -1 * delta)) {
                // IE浏览器下滚动会跨越边界直接影响父级滚动，因此，临界时候手动边界滚动定位
                this.scrollTop = delta > 0? 0: scrollHeight;
                // 向上滚 || 向下滚
                event.preventDefault();
            }        
        });
    }); 
};
