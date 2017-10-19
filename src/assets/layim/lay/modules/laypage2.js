/**
 * 分页2.0.0
 *
 *
 *
 * 流加载示例
 * laypage({
 *    cont: 'page8', //容器。值支持id名、原生dom对象，jquery对象,
 *    pages: 7, //总页数
 *    groups: 0, //连续分数数0
 *    prev: false, //不显示上一页
 *    next: '查看更多',
 *    skin: 'flow', //设置信息流模式的样式
 *    jump: function(obj){
 *      if(obj.curr === 6){
 *        this.next = '没有更多了';
 *      }
 *      $('#view8').append(appendimg(obj.curr));
 *    }
 *  });
 */
;!function(window, undefined){
    //开启严格模式
    "use strict";

    function laypage(options){
        var skin = 'laypagecss';
        new Page(options);
    }

    var doc = document, id = 'getElementById', tag = 'getElementsByTagName';
    /**
     * 支持多开分页栏
     * @type {number}
     */
    var index = 0;

    /**
     * 分页对象
     * @param options
     * options.pages 总页数 默认0
     * options.curr 当前页 默认1
     * options.groups 连续显示分页数 默认5，在设置为0的时候用于流加载
     * options.first 首页按钮显示内容，设置false为隐藏此按钮，默认‘首页’
     * options.last 末页按钮显示内容，设置false为隐藏此按钮，默认‘末页’
     * options.prev 上一页按钮显示内容，设置false为隐藏此按钮，默认‘上一页’
     * options.next 下一页按钮显示内容，设置false为隐藏此按钮，默认‘下一页’
     * options.skin 当前页皮肤
     * options.skip 是否加入跳页功能，默认false
     * options.hash 通过hash，你可以记录当前页。注意url的变化，这是个锚点地位
     * options.jump 跳转的时候触发的事件，最常用的就是动态ajax从后台获取分页数据
     *
     * @constructor
     */
    var Page = function(options){
        this.v = '2.0.0'
        var that = this;
        var conf = that.config = options || {};
        conf.item = index++;
        that.render(true);
    };

    /**
     * 给元素绑定事件
     * @param elem 原生dom对象
     * @param even 触发事件
     * @param fn 触发方法
     * @returns {Page}
     */
    Page.prototype.on = function(elem, even, fn){
        elem.attachEvent ? elem.attachEvent('on'+ even, function(){
            fn.call(elem, window.even); //for ie, this指向为当前dom元素
        }) : elem.addEventListener(even, fn, false);
        return Page;
    };

    /**
     * 判断传入的容器类型
     * 支持id名、原生dom对象，jquery对象，分别对应1,2,3
     * @returns {number}
     */
    Page.prototype.type = function(){
        var conf = this.config;
        if(typeof conf.cont === 'object'){
            return conf.cont.length === undefined ? 2 : 3;
        }
        return 1;
    };

    /**
     * 分页视图
     * @returns {*}
     */
    Page.prototype.view = function(){
        var that = this, conf = that.config, view = [], dict = {};
        /**
         * 总页数，默认为0,数据出错会强制转成0
         * @type {number}
         */
        conf.pages = conf.pages|0;
        /**
         * 当前页数，默认为1,数据出错会强制转成0
         * @type {number}
         */
        conf.curr = (conf.curr|0) || 1;
        /**
         * 连续显示分页数，默认5,数据出错会强制转成0
         * @type {number}
         */
        conf.groups = 'groups' in conf ? (conf.groups|0) : 5;
        /**
         * 首页按钮显示内容，支持html，默认首页（转义序列unicode编码(16进制)，防止乱码）http://tool.oschina.net/encode
         * @type {string}
         */
        conf.first = 'first' in conf ? conf.first : '&#x9996;&#x9875;';
        /**
         * 末页按钮显示内容，支持html，默认末页（转义序列unicode编码(16进制)，防止乱码）http://tool.oschina.net/encode
         * @type {string}
         */
        conf.last = 'last' in conf ? conf.last : '&#x672B;&#x9875;';
        /**
         * 上一页按钮显示内容，支持html，默认上一页（转义序列unicode编码(16进制)，防止乱码）http://tool.oschina.net/encode
         * @type {string}
         */
        conf.prev = 'prev' in conf ? conf.prev : '&#x4E0A;&#x4E00;&#x9875;';
        /**
         * 下一页按钮显示内容，支持html，默认下一页（转义序列unicode编码(16进制)，防止乱码）http://tool.oschina.net/encode
         * @type {string}
         */
        conf.next = 'next' in conf ? conf.next : '&#x4E0B;&#x4E00;&#x9875;';

        /**
         * 如果总页数不超过2，那就不需要显示分页栏了
         */
        if(conf.pages <= 1){
            return '';
        }

        /**
         * 如果连续显示分页数大于总页数，以总页数为准
         */
        if(conf.groups > conf.pages){
            conf.groups = conf.pages;
        }

        /**
         * 计算当前组，根据它判断是否显示首页末页2个按钮
         * 连续显示分页数为一个组单位
         * 例如：（3+5）/5 为1组，（5+5）/2 为2组
         * 容错config.group:0的情况
         * @type {number}
         */
        dict.index = Math.ceil((conf.curr + ((conf.groups > 1 && conf.groups !== conf.pages) ? 1 : 0))/(conf.groups === 0 ? 1 : conf.groups));

        /**
         * 当前页非首页，则输出上一页
         */
        if(conf.curr > 1 && conf.prev){
            view.push('<a href="javascript:;" class="layui-laypage-prev" data-page="'+ (conf.curr - 1) +'">'+ conf.prev +'</a>');
        }

        /**
         * 当前组非首组，并且需要显示首页按钮，并且包含连续显示分页数（正整数），则输出首页
         * 因为在groups为0的情况下只显示上一页和下一页按钮，所以要判断
         */
        if(dict.index > 1 && conf.first && conf.groups !== 0){
            view.push('<a href="javascript:;" class="laypage_first" data-page="1"  title="&#x9996;&#x9875;">'+ conf.first +'</a><span>&#x2026;</span>');
        }

        /**
         * 当前页左右2边显示的页个数
         * 例如连续显示分页数为5，则左右2边各显示2个，如果连续显示分页数为6，则左边显示2个，右边显示3个
         * @type {number}
         */
        dict.poor = Math.floor((conf.groups-1)/2);
        /**
         * 当前组左边显示的最小页
         * 如果是第一组则是1
         * @type {number}
         */
        dict.start = dict.index > 1 ? conf.curr - dict.poor : 1;
        /**
         * 当前组右边边显示的最大页
         * 如果是第一组，则是连续显示分页数
         * 如果是最大组，则直接显示最大页数
         * conf.groups - dict.poor - 1：右边显示页的个数
         * @type {number}
         */
        dict.end = dict.index > 1 ? (function(){
            var max = conf.curr + (conf.groups - dict.poor - 1);
            return max > conf.pages ? conf.pages : max;
        }()) : conf.groups;
        /**
         * 最后一组会出现的情况，最大数-最小数小于连续显示分页数
         * 最小数设置为最大页数-连续显示分页数
         */
        if(dict.end - dict.start < conf.groups - 1){
            dict.start = dict.end - conf.groups + 1;
        }
        /**
         * 在得出当前页显示的左边最小页和右边最大页之后，可以生成分页栏
         * 这个时候可以对当前页增加皮肤
         */
        for(; dict.start <= dict.end; dict.start++){
            if(dict.start === conf.curr){
                view.push('<span class="layui-laypage-curr"><em class="layui-laypage-em" '+ (/^#/.test(conf.skin) ? 'style="background-color:'+ conf.skin +';' : '') +'"></em><em>'+ dict.start +'</em></span>');
            } else {
                view.push('<a href="javascript:;" data-page="'+ dict.start +'">'+ dict.start +'</a>');
            }
        }

        /**
         * 总页数大于连续分页数，且当前组最大页小于总页，输出尾页
         */
        if(conf.pages > conf.groups && dict.end < conf.pages && conf.last && conf.groups !== 0){
            view.push('<span>&#x2026;</span><a href="javascript:;" class="layui-laypage-last" title="&#x5C3E;&#x9875;"  data-page="'+ conf.pages +'">'+ conf.last +'</a>');
        }

        /**
         * 当前页不为尾页时，输出下一页
         * @type {boolean}
         */
        dict.flow = !conf.prev && conf.groups === 0;
        if(conf.curr !== conf.pages && conf.next || dict.flow){
            view.push((function(){
                return (dict.flow && conf.curr === conf.pages)
                    ? '<span class="layui-laypage-nomore" title="&#x5DF2;&#x6CA1;&#x6709;&#x66F4;&#x591A;">'+ conf.next +'</span>'
                    : '<a href="javascript:;" class="layui-laypage-next" data-page="'+ (conf.curr + 1) +'">'+ conf.next +'</a>';
            }()));
        }

        return '<div class="layui-box layui-laypage layui-laypage-'+ (conf.skin ? (function(skin){
                return /^#/.test(skin) ? 'molv' : skin;
            }(conf.skin)) : 'default') +'" id="layui-laypage-'+ that.config.item +'">'+ view.join('') + function(){
                return conf.skip
                    ? '<span class="layui-laypage-total">&#x5230;&#x7B2C; <input type="number" min="1" onkeyup="this.value=this.value.replace(/\\D/, \'\');" value="'+ conf.curr +'" class="layui-laypage-skip"> &#x9875; '
                + '<button type="button" class="layui-laypage-btn">&#x786e;&#x5b9a;</button></span>'
                    : '';
            }() +'</div>';
    };

    /**
     * 跳页，绑定各元素的事件
     * @param elem 指定分页栏，原生dom对象
     */
    Page.prototype.jump = function(elem){
        if(!elem) return;
        var that = this, conf = that.config, childs = elem.children;
        var btn = elem[tag]('button')[0];
        var input = elem[tag]('input')[0];
        /**
         * 绑定事件，包括a标签的点击事件和跳转功能的确定按钮的点击事件
         */
        for(var i = 0, len = childs.length; i < len; i++){
            if(childs[i].nodeName.toLowerCase() === 'a'){
                this.on(childs[i], 'click', function(){
                    var curr = this.getAttribute('data-page')|0;
                    conf.curr = curr;
                    that.render();
                });
            }
        }
        if(btn){
            this.on(btn, 'click', function(){
                var curr = input.value.replace(/\s|\D/g, '')|0;
                if(curr && curr <= conf.pages){
                    conf.curr = curr;
                    that.render();
                }
            });
        }
    };

    /**
     * 渲染分页
     * @param load 是否是初始化渲染
     */
    Page.prototype.render = function(load){
        var that = this, conf = that.config, type = that.type();
        var view = that.view();
        if(type === 2){
            conf.cont.innerHTML = view;
        } else if(type === 3){
            conf.cont.html(view);
        } else {
            doc[id](conf.cont).innerHTML = view;
        }
        conf.jump && conf.jump(conf, load);
        that.jump(doc[id]('layui-laypage-' + conf.item));
        if(conf.hash && !load){
            location.hash = '!'+ conf.hash +'='+ conf.curr;
        }
    };

    window.laypage = laypage;

}(window);

