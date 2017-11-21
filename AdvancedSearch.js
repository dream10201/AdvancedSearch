;(function (window, document) {//$,window, document
    /**
     * 用于参数合并
     * @param defaultOptions
     * @param options
     * @returns {*}
     */
    function merge(defaultOptions, options) {
        for (var i in defaultOptions) {
            if (options.hasOwnProperty(i)) {
                defaultOptions[i] = options[i];
            }
        }
        return defaultOptions;
    }

    /**
     * 窗体移动事件绑定及处理代码
     * @constructor
     */
    function FormMove(d) {
        var isMove = false, x, y;
        var advancedsearch = d.view.advancedsearch;
        var getstyle = window.getComputedStyle(advancedsearch, null);
        //标题栏，监听鼠标移入
        d.view.advancedsearch_title.addEventListener("mousedown", function (e) {
            x = e.clientX;
            y = e.clientY;
            isMove = true;
        }, false);
        d.view.advancedsearch.addEventListener("mouseup", function () {
            isMove = false;
        }, false);
        d.view.advancedsearch.addEventListener("mousemove", function (e) {
            if (isMove) {
                //移动窗体
                var mx = e.clientX;
                var my = e.clientY;
                var left = parseInt(getstyle.left.split("px")[0]);
                var top = parseInt(getstyle.top.split("px")[0]);
                var width = parseInt(getstyle.width.split("px")[0]);
                var height = parseInt(getstyle.height.split("px")[0]);

                var documentHeight = document.documentElement.clientHeight - height;
                var documentWidth = document.documentElement.clientWidth - width;

                if (top >= documentHeight) advancedsearch.style.top = documentHeight;
                if (left >= documentWidth) advancedsearch.style.left = documentWidth;

                if (left <= 0) advancedsearch.style.left = 0 + "px";
                if (top <= 0) advancedsearch.style.top = 0 + "px";

                if (mx > x && left < documentWidth) {
                    advancedsearch.style.left = (left + (mx - x)) + "px";
                } else if (mx < x && left > 0) {
                    advancedsearch.style.left = left - (x - mx) + "px";
                }
                if (my > y && top < documentHeight) {
                    advancedsearch.style.top = top + (my - y) + "px";
                } else if (my < y && top > 0) {
                    advancedsearch.style.top = top - (y - my) + "px";
                }
                x = e.clientX;
                y = e.clientY;

            }
        });
    }

    /**
     * 下拉dd事件绑定
     */
    function ddClick() {
        var _this = this;
        //this -> Superior -> Previous brothers
        this.parentNode.previousSibling.value = _this.innerHTML;
        // DynamicVal(_this);//动态修改值的input
    }

    /**
     * 用于创建下拉框,根据explanation创建option
     * @param explanation
     * @returns {Element}
     * @constructor
     */
    function CreateSelectVal(explanation, code, type, explanation, d) {
        var advancedsearch_content_row_right = document.createElement("div");
        advancedsearch_content_row_right.className = "advancedsearch_content_row_right";
        advancedsearch_content_row_right.dataset.align = "right";
        var advancedsearch_select = document.createElement("input");
        advancedsearch_select.dataset.code = code;
        advancedsearch_select.dataset.type = type;
        advancedsearch_select.dataset.explanation = explanation;
        advancedsearch_select.className = "advancedsearch_select advancedsearch_ordinary";

        //检索框事件绑定
        advancedsearch_select.addEventListener("focus", function (event) {
            selectInput(this, d, event);
        });
        advancedsearch_select.addEventListener("blur", function (event) {
            selectInput(this, d, event);
        });
        advancedsearch_select.addEventListener("input", function (event) {
            selectInput(this, d, event);
        });

        explanation = JSON.parse(explanation);
        var dl = document.createElement("dl");
        for (var i in explanation) {
            var dd = document.createElement("dd");
            dd.innerHTML = i;
            dd.dataset.value = explanation[i];
            dd.addEventListener("click", ddClick);
            dl.appendChild(dd);
        }
        //组装
        advancedsearch_content_row_right.appendChild(advancedsearch_select);
        advancedsearch_content_row_right.appendChild(dl);
        return advancedsearch_content_row_right;

    }

    /**
     * 用于创建默认input
     * @param code
     * @returns {[null,null]}
     * @constructor
     */
    function CreateInput(code, type) {
        var advancedsearch_content_row_right = document.createElement("div");
        advancedsearch_content_row_right.className = "advancedsearch_content_row_right";
        advancedsearch_content_row_right.dataset.align = "right";
        var advancedsearch_val = document.createElement("input");
        advancedsearch_val.className = "advancedsearch_val advancedsearch_ordinary";
        advancedsearch_val.dataset.code = code;
        advancedsearch_val.dataset.type = type;
        advancedsearch_val.dataset.value = "";
        advancedsearch_val.type = "text";
        advancedsearch_content_row_right.appendChild(advancedsearch_val);
        return [advancedsearch_content_row_right, advancedsearch_val];
    }

    /**
     * 创建时间区间
     * @param code
     * @returns {[null,null]}
     * @constructor
     */
    function CreateDateInputs(code, type, dateformat) {
        var advancedsearch_content_row_right = document.createElement("div");
        advancedsearch_content_row_right.className = "advancedsearch_content_row_right";
        advancedsearch_content_row_right.dataset.align = "right";

        var dateBox = document.createElement("div");
        dateBox.className = "advancedsearch_content_row_right_box";
        var span = document.createElement("span");
        span.innerHTML = "&nbsp;-&nbsp;";
        var inputs = [];
        for (var i = 0; i < 2; i++) {
            var advancedsearch_val = document.createElement("input");
            advancedsearch_val.className = "advancedsearch_val advancedsearch_interval";
            advancedsearch_val.dataset.code = code;
            advancedsearch_val.dataset.type = type;
            advancedsearch_val.dataset.dateformat = dateformat;
            advancedsearch_val.dataset.value = "";
            advancedsearch_val.type = "text";
            if (i == 1) dateBox.appendChild(span);
            dateBox.appendChild(advancedsearch_val);
            inputs.push(advancedsearch_val);
        }

        advancedsearch_content_row_right.appendChild(dateBox);
        return [advancedsearch_content_row_right, inputs];
    }

    /**
     * 根据type动态更改值界面
     * @param dd
     * @constructor
     */
    function DynamicVal(dd, d) {
        var dd_code = dd.dataset.code;
        var dd_type = dd.dataset.type;
        //得到row
        var row = dd.parentNode.parentNode.parentNode;
        dd_type = dd_type.toLowerCase();
        if (dd_type == "date" || dd_type == "timestamp" || dd_type == "datetime" || dd_type == "time") {
            //时间类型
            var input = CreateDateInputs(dd_code, dd_type, dd.dataset.dateformat);
            row.replaceChild(input[0], row.childNodes[1]);
            d.options.dateInput(input[1], dd.dataset.dateformat);//回调
        } else {
            //下拉框或者普通文本类型
            if ((typeof dd.dataset.explanation) != "undefined" && dd.dataset.explanation != "") {
                //下拉框
                var explanation = dd.dataset.explanation;
                //替换节点
                row.replaceChild(CreateSelectVal(explanation, dd_code, dd_type, explanation, d), row.childNodes[1]);
            } else {
                //普通文本
                var input = CreateInput(dd_code, dd_type);
                row.replaceChild(input[0], row.childNodes[1]);
            }
        }
    }

    /**
     * 下拉检索框事件
     * @param k
     */
    function selectInput(u, d, event) {
        var _this = u;
        var type = event.type;
        var dl = _this.nextSibling;//取得下一兄弟节点，也就是dl
        switch (type) {
            case "focus":
                dl.style.display = "block";
                break;
            case "blur":
                //防止与dd选择事件冲突
                setTimeout(function () {
                    var val = _this.value;
                    //获取所有子节点nodes
                    var dds = dl.childNodes;
                    var isexist = false;
                    for (var i = 0; i < dds.length; i++) {
                        var dd = dds.item(i);
                        if (dd.innerHTML == val) {
                            isexist = true;
                            var ddVal = dd.dataset.value;
                            if ((typeof ddVal) != "undefined" && ddVal != null && ddVal != "") {
                                _this.dataset.value = ddVal;
                            } else {
                                _this.dataset.value = "";
                            }
                            //判断是否为右边select
                            if (dl.parentNode.dataset.align != "right") {
                                //初始化对应input结果
                                var valInput = _this.parentNode.nextSibling.childNodes.item(0);
                                valInput.dataset.code = "";
                                DynamicVal(dd, d);//动态修改值的input
                            }
                            break;
                        }
                    }
                    if (!isexist) {
                        _this.value = "";
                        for (var i = 0; i < dds.length; i++) {
                            dds.item(i).style.display = "block";
                        }
                    }
                    //隐藏dl
                    dl.style.display = "none";
                }, 150);
                break;
            case "input":
                var dds = dl.childNodes;
                if (_this.value != "") {
                    for (var i = 0; i < dds.length; i++) {
                        var dd = dds.item(i);
                        if (dd.innerHTML.indexOf(_this.value) != -1) {
                            dd.style.display = "block";
                        } else {
                            dd.style.display = "none";
                        }
                    }
                } else {
                    for (var i = 0; i < dds.length; i++) {
                        dds.item(i).style.display = "block";
                    }
                }
                break;
        }
    }

    /**
     * 用于删除row
     * @constructor
     */
    function DeleteRow() {
        var row = this.parentNode;
        this.parentNode.parentNode.removeChild(row);
    }

    function isEmpty(e) {
        for (var i in e) {
            return false;
        }
        return true;
    }

    /**
     * 动态创建默认select
     * @constructor
     */
    function CreateSelectDom(d) {
        var advancedsearch_content_row = document.createElement("div");
        advancedsearch_content_row.className = "advancedsearch_content_row";
        var advancedsearch_content_row_left = document.createElement("div");
        advancedsearch_content_row_left.className = "advancedsearch_content_row_left";
        advancedsearch_content_row_left.dataset.align = "left";
        var advancedsearch_content_row_right = document.createElement("div");
        advancedsearch_content_row_right.className = "advancedsearch_content_row_right";
        advancedsearch_content_row_right.dataset.align = "right";
        var advancedsearch_content_row_close = document.createElement("div");
        advancedsearch_content_row_close.className = "advancedsearch_content_row_close";
        advancedsearch_content_row_close.innerHTML = "—";
        advancedsearch_content_row_close.addEventListener("click", DeleteRow);
        var advancedsearch_val = document.createElement("input");
        advancedsearch_val.type = "text";
        advancedsearch_val.className = "advancedsearch_val advancedsearch_ordinary";
        var advancedsearch_select = document.createElement("input");
        advancedsearch_select.type = "text";
        advancedsearch_select.className = "advancedsearch_select advancedsearch_ordinary";
        //检索框事件绑定
        advancedsearch_select.addEventListener("focus", function (event) {
            selectInput(this, d, event)
        });
        advancedsearch_select.addEventListener("blur", function (event) {
            selectInput(this, d, event)
        });
        advancedsearch_select.addEventListener("input", function (event) {
            selectInput(this, d, event)
        });

        var dl = document.createElement("dl");
        var ddArray = d.options["columns"];
        for (var i = 0; i < ddArray.length; i++) {
            var obj = ddArray[i];
            var dd = document.createElement("dd");
            dd.innerHTML = obj["title"];
            dd.dataset.type = obj["type"];
            dd.dataset.code = obj["code"];
            dd.dataset.value = "";
            if (obj.hasOwnProperty("explanation")) dd.dataset.explanation = JSON.stringify(obj["explanation"]);
            if (obj.hasOwnProperty("dateformat")) dd.dataset.dateformat = obj["dateformat"];
            //dd事件绑定
            dd.addEventListener("click", ddClick);
            dl.appendChild(dd);
        }
        //组合
        //left
        advancedsearch_content_row_left.appendChild(advancedsearch_select);
        advancedsearch_content_row_left.appendChild(dl);
        //right
        advancedsearch_content_row_right.appendChild(advancedsearch_val);
        //row
        advancedsearch_content_row.appendChild(advancedsearch_content_row_left);
        advancedsearch_content_row.appendChild(advancedsearch_content_row_right);
        advancedsearch_content_row.appendChild(advancedsearch_content_row_close);
        return advancedsearch_content_row;
    }

    /**
     * 底部按钮事件绑定
     * @constructor
     */
    function ControlEvent(d) {
        d.view.advancedsearch_add_btn.addEventListener("click", function () {
            d.view.advancedsearch_content.appendChild(CreateSelectDom(d));
        });
        d.view.advancedsearch_add_search.addEventListener("click", function () {
            //整理所有结果(普通结果)
            var inputs = d.view.advancedsearch.querySelectorAll(".advancedsearch_content_row_right input.advancedsearch_ordinary");
            var result = [];
            for (var i = 0; i < inputs.length; i++) {
                var input = inputs[i];
                var obj = {};
                if (input.value != "" && input.parentNode.previousSibling.childNodes.item(0).value != "") {
                    if (input.dataset.value != "") {//选择类判断
                        //select
                        obj["value"] = input.dataset.value;
                        obj["code"] = input.dataset.code;
                        obj["type"] = input.dataset.type;
                        obj["explanation"] = input.dataset.explanation;
                    } else {
                        obj["value"] = input.value;
                        obj["code"] = input.dataset.code;
                        obj["type"] = input.dataset.type;
                    }
                    if (!isEmpty(obj)) result.push(obj);
                }
            }
            //区间
            var dateInputBox = d.view.advancedsearch.querySelectorAll(".advancedsearch_content_row_right .advancedsearch_content_row_right_box");
            for (var j = 0; j < dateInputBox.length; j++) {
                var dates = dateInputBox[j].childNodes;//获取子元素集合
                var interval = "", obj = {};
                for (var k = 0; k < dates.length; k++) {
                    if (dates[k].classList.contains('advancedsearch_interval')) {
                        if (dates[k].value != "" && dates[k].parentNode.parentNode.previousSibling.childNodes.item(0).value != "") {
                            obj["code"] = dates[k].dataset.code;
                            obj["type"] = dates[k].dataset.type;
                            interval += dates[k].value + (k == 0 ? "#" : "");
                        }
                    }
                }
                if (interval != "") obj["value"] = interval;
                if (!isEmpty(obj)) result.push(obj);
            }
            d.options.search(result);
        });
    }

    /**
     * 退出事件
     * @constructor
     */
    function CloseEvent(d) {
        d.view.advancedsearch_close.addEventListener("click", function () {
            hide(d);
            d.options.close();//退出回调
        });
    }

    /**
     * 隐藏窗体
     */
    function hide(d) {
        if (d.options.shadeEnable) {
            d.view.advancedsearch_cover.style.display = "none";
        }
        // document.getElementById("advancedsearch").style.display = "none";
        d.view.advancedsearch.style.display = "none";
    }

    /**
     * 显示窗体
     */
    function show(d) {
        if (d.options.shadeEnable) {
            d.view.advancedsearch_cover.style.display = "block";
        }
        // document.getElementById("advancedsearch").style.display = "block";
        d.view.advancedsearch.style.display = "block";
    }

    /**
     * 用于创建默认框架
     * @constructor
     */
    function DefaultBox(d) {
        var advancedsearch_cover = document.createElement("div");
        advancedsearch_cover.className = "advancedsearch_cover";
        var advancedsearch = document.createElement("div");
        advancedsearch.className = "advancedsearch";
        var advancedsearch_title = document.createElement("div");
        advancedsearch_title.className = "advancedsearch_title";
        var advancedsearch_title_txt = document.createElement("div");
        advancedsearch_title_txt.className = "advancedsearch_title_txt";
        var advancedsearch_title_txt_span = document.createElement("span");
        advancedsearch_title_txt_span.className = "advancedsearch_title_txt_span";
        var advancedsearch_close = document.createElement("div");
        advancedsearch_close.className = "advancedsearch_close";
        var span = document.createElement("span");
        span.innerHTML = "X";
        var advancedsearch_content = document.createElement("div");
        advancedsearch_content.className = "advancedsearch_content";
        var advancedsearch_control = document.createElement("div");
        advancedsearch_control.className = "advancedsearch_control";
        var advancedsearch_add_btn = document.createElement("button");
        advancedsearch_add_btn.className = "advancedsearch_add_btn";
        advancedsearch_add_btn.innerHTML = "Add";
        var advancedsearch_add_search = document.createElement("button");
        advancedsearch_add_search.className = "advancedsearch_add_search";
        advancedsearch_add_search.innerHTML = "Search";
        //组装
        advancedsearch.appendChild(advancedsearch_title);
        advancedsearch.appendChild(advancedsearch_content);
        advancedsearch.appendChild(advancedsearch_control);
        advancedsearch_title.appendChild(advancedsearch_title_txt);
        advancedsearch_close.appendChild(span);
        advancedsearch_title.appendChild(advancedsearch_close);
        advancedsearch_title_txt.appendChild(advancedsearch_title_txt_span);
        advancedsearch_control.appendChild(advancedsearch_add_btn);
        advancedsearch_control.appendChild(advancedsearch_add_search);
        document.querySelector("body").appendChild(advancedsearch_cover);
        document.querySelector("body").appendChild(advancedsearch);
        d.view.advancedsearch = advancedsearch;
        d.view.advancedsearch_title_txt_span = advancedsearch_title_txt_span;
        d.view.advancedsearch_content = advancedsearch_content;
        d.view.advancedsearch_close = advancedsearch_close;
        d.view.advancedsearch_cover = advancedsearch_cover;
        d.view.advancedsearch_title = advancedsearch_title;
        d.view.advancedsearch_add_btn = advancedsearch_add_btn;
        d.view.advancedsearch_add_search = advancedsearch_add_search;
    }

    /*----------------------------------------------------------------------------------------------------------------*/
    //入口
    var AsSearch = function (targetDom, options) {
        // 判断是用函数创建的还是用new创建的。这样我们就可以通过AsSearch("dom") 或 new AsSearch("dom")来使用这个插件了
        if (!(this instanceof AsSearch)) return new AsSearch(targetDom, options);

        //判断触发目标是字符串还是dom
        if ((typeof targetDom) == "string") {
            this.targetDom = document.querySelector(targetDom);
        } else {
            this.targetDom = targetDom;
        }
        //默认界面
        this.init(options);
    }
    AsSearch.prototype = {
        init: function (options) {
            var defaultOptions = {
                size: [700, 400],//初始弹窗宽、高
                shadeEnable: true,//遮罩层开关
                shade: ["#000", 0.3],//遮罩层，黑色0.3透明度
                shadeClose: false,//点击遮罩层是否关闭
                shadeZindex: 1000000,//遮罩层z-index，弹窗默认+1
                title: "Advanced Search",//弹窗标题
                columns: [],//下拉条件
                success: function () {
                },//弹出成功后回调
                search: function (result) {
                },//搜索按钮回调
                close: function () {
                },//关闭回调
                dateInput: function (obj, dateformat) {
                }//input -> date回调
            };
            this.view = {}
            options = this.options = merge(defaultOptions, options);
            //检查框架是否存在
            if (!this.hasOwnProperty("view") || !this["view"].hasOwnProperty("advancedsearch")) {
                DefaultBox(this);
            }
            //配置标题
            this.view.advancedsearch_title_txt_span.innerHTML = options.title;
            //z-index配置
            this.view.advancedsearch.style.zIndex = options.shadeZindex + 1;
            this.view.advancedsearch_cover.style.zIndex = options.shadeZindex;
            //遮罩层点击事件
            if (options.shadeClose) {

            }
            //窗体大小及位置
            var advancedsearch = this.view.advancedsearch;
            advancedsearch.style.width = options.size[0] + "px";
            advancedsearch.style.height = options.size[1] + "px";
            advancedsearch.style.left = "calc(50% - " + (this.options.size[0] / 2) + "px)";
            advancedsearch.style.top = "calc(50% - " + (this.options.size[1] / 2) + "px)";
            //遮罩层颜色及透明度
            this.view.advancedsearch_cover.style.backgroundColor = options.shade[0];
            this.view.advancedsearch_cover.style.opacity = options.shade[1];
            //添加默认条件
            this.view.advancedsearch_content.appendChild(CreateSelectDom(this));
            //初始化事件监听
            this.event();
        },
        event: function () {
            var _this = this;
            //用户触发按钮
            FormMove(this);//窗体移动
            ControlEvent(this);//底部按钮事件绑定
            CloseEvent(this);//退出事件
            /**
             * 用户绑定元素
             */
            this.targetDom.addEventListener("click", function () {
                show(_this);
            });
            this.options.success();//成功回调
        },
        remove: function () {
            //清理痕迹
            document.querySelector("body").removeChild(this.view.advancedsearch_cover);
            document.querySelector("body").removeChild(this.view.advancedsearch);
        },
        /**
         * 重新渲染
         */
        render: function () {
            this.remove();
            this.init(this.options);
        },
        /**
         * 隐藏窗体
         */
        hide: function () {
            hide(this);
        },
        show: function () {
            show(this);
        }
    }
    window.AsSearch = AsSearch;//暴露方法
})(window, document);////$,window, document