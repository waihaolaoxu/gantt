var ganttFn = {
    init: function (opt) {
        this._isPattern = opt.isPattern;
        this._date = new Date();
        
        this._template();
        this._event();
        this._config();
        
        gantt.init(opt.id);
        gantt.parse(opt.data);
        this.__config(); //这里存放的是必须为init后配置才生效的
        this.fitTasks();
    },
    // 获取一条线上的蚂蚱
    getConnectedGroup:function(id){
        var data = {
            tasks_left:[],
            tasks_right:[]
        }
        function _eachPre(task){ //遍历下一个link
            task.$source.forEach(function (linkId, index) {
                var nextId = gantt.getLink(linkId).target; //下一个task id
                var nextTask = gantt.getTask(nextId); //下一个task
                if (nextTask.$source.length) {
                    nextTask.$source.forEach(function (linkId, index) {
                        _eachPre(gantt.getTask(gantt.getLink(linkId).target)); //递归
                    });
                }
                data.tasks_right.push(nextId);
            });
        }
        function _eachNext(task){ //遍历下上个link
            task.$target.forEach(function (linkId, index) {
                var nextId = gantt.getLink(linkId).source; //上一个task id
                var nextTask = gantt.getTask(nextId); //上一个task
                if (nextTask.$target.length) {
                    nextTask.$target.forEach(function (linkId, index) {
                        _eachNext(gantt.getTask(gantt.getLink(linkId).source)); //递归
                    });
                }
                data.tasks_left.push(nextId);
            });
        }
        _eachPre(gantt.getTask(id));
        _eachNext(gantt.getTask(id));
        return data;
    },
    // 自适应 二级 task
    fitTasks:function(){
        gantt.eachTask(function(task){
            var dates = gantt.getSubtaskDates(task.id);
            if(task.$level===1 && dates.start_date && dates.end_date){
                task.start_date = dates.start_date;
                task.end_date = dates.end_date;
                gantt.updateTask(task.id);
            }
        })
    },
    //日期改成自然数
    _getDayNum:function(e){
        return Math.ceil((e - gantt.getState().min_date)/(1000*60*60*24))+1
    },
    // 配置信息（init后生效的）
    __config:function(){
        if(this._isPattern){ //date_scale 二者只能有一个 否则就会失效
            gantt.templates.date_scale = function (e) {
                return '模板'
            }
        }else{
            gantt.config.date_scale = "%Y年 %F";
        }
    },
    // 配置信息
    _config: function () {
        var _self = this;
        // gantt.config.readonly = true;//只读模式
        gantt.config.order_branch = true; //启用拖动
        gantt.config.order_branch_free = false; //禁止二级拖进三级
        gantt.config.show_progress = false; //是否显示进度
        gantt.config.work_time = false; //是否只在工作日施工
        gantt.config.correct_work_time = true; //工作日
        gantt.config.min_column_width = 60; //单元格最小宽度
        gantt.config.duration_unit = "day";
        gantt.config.row_height = 26; //行高
        // gantt.config.fit_tasks = true; //拖动任务重绘
        gantt.config.lightbox.sections = [{
                name: "description",
                height: 40,
                map_to: "text",
                type: "textarea",
                focus: true
            },
            {
                name: "type",
                type: "typeselect",
                map_to: "type"
            },
            {
                name: "time",
                height: 40,
                type: "duration",
                map_to: "auto"
            }
        ];
        gantt.config.scale_height = 50;
        gantt.config.scale_unit = "month";
        gantt.config.subscales = [{
            unit: "day",
            step: 1,
            date: "%j",
            template: function (e) {
                if(_self._isPattern){
                    return _self._getDayNum(e);
                }else{
                    if(0 == e.getDay() || 6 == e.getDay()){
                        return (`
                        <div class='weekend-flag-box' style='background: #EFF5FD;line-height: 23px;'>
                            ${e.getDate()}
                            <div class='weekend-shadow'></div>
                        </div>`)
                    }
                    return e.getDate();
                }
            }
        }];
        
        gantt.config.columns = [{
                name: "text",
                label: "阶段及工序名称",
                width: "160",
                tree: true,
                resize: true
            },
            {
                name: "start_date",
                label: _self._isPattern?"开始天数":"开始时间",
                width: '80',
                align: "center",
                template:function(e){
                    if(_self._isPattern){
                        return '第'+ _self._getDayNum(e.start_date) +'天';
                    }
                    return e.start_date;
                }
            },
            {
                name: "duration",
                width:50,
                label: "天数",
                align: "center"
            }
        ];
        if(_self._isPattern){
            gantt.config.columns.push({
                name: "edit",
                label: "操作",
                width: '80',
                align: "center",
                template:function(e){
                    if (1 === e.$level) {
                        return '<div class="gantt_add"><span class="bv-add-btn2">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span></div>';
                    }
                    return '';
                }
            })
        }
    },
    // 模版配置
    _template: function () {
        var _self = this;
        // 提示层模版
        gantt.templates.tooltip_text = function (start, end, task) {
            if(_self._isPattern){
                return "";
            }
            return "<b>任务:</b> " + task.text + "<br/><b>开始时间:</b> " +
                gantt.templates.tooltip_date_format(start) +
                "<br/><b>结束时间:</b> " + gantt.templates.tooltip_date_format(end);
        };

        // 任务弹层配置
        gantt.templates.lightbox_header = function (start_date, end_date, task) {
            return '编辑'
            // return gantt.templates.task_time(task.start_date, task.end_date, task)  +  "&nbsp;" +
            // (gantt.templates.task_text(task.start_date, task.end_date, task) || "").substr(0, 70);
        };

        // 周末底色设置
        // gantt.templates.task_cell_class = function (task, date) {
        //     if (!gantt.isWorkTime(date))
        //         return "week_end";
        //     return "";
        // };
        // gantt.templates.scale_cell_class = function(date){
        //     if(date.getDay()==0||date.getDay()==6){
        //         return "week_end";
        //     }
        //     return '';
        // };

        // 周末底色
        gantt.templates.task_cell_class = function (item, date) {
            if (date.getDay() == 0 || date.getDay() == 6) {
                return "week_end"
            }
        };

        //任务条颜色状态
        // gantt.templates.task_class = function(start, end, task){
        //     if(new Date(task.start_date)>new Date()){
        //         return 'state01';
        //     }
        //     return ''
        // };

        //左侧列表图标
        gantt.templates.grid_folder = function (e) {
            if (e.$level === 0) {
                return '<i class="iconfont icon-ziyuan"></i>';
            } 
            else if (e.$level === 1) {
                return '<i class="iconfont icon-weixiu"></i>';
            } else {
                return '<i class="iconfont icon-woderenwu"></i>';
            }
        }

        //任务样式
        gantt.templates.task_class = function (start, end, task) {
            if (task.$level === 0) {
                return 'gantt_bv_project father'
            } else if (task.$level === 1) {
                return 'gantt_bv_task father'
            }
            return 'gantt_bv_task'
        }
    },
    // 事件
    _event: function () {
        var _self = this;

        // 屏蔽双击弹出编辑层
        gantt.attachEvent("onTaskDblClick", function (id, e) {
            return false;
        });

        // // 任务拖动逻辑处理、拖动只级联右侧关联的，前面的判断间隔，如果不满足直接退回
        // function taskNextReset(task, oldTask) { //可以用old还原
        //     var startdate = new Date(task.end_date.getTime() + 1000 * 60 * 60 * 24);
        //     task.$source.forEach(function (linkId, index) {
        //         var nextId = gantt.getLink(linkId).target; //下一个task id
        //         var nextTask = gantt.getTask(nextId); //下一个task
        //         var enddate = gantt.calculateEndDate(startdate, nextTask.duration);
        //         nextTask.end_date = enddate;
        //         nextTask.start_date = startdate;
        //         gantt.updateTask(nextId);
        //         if (nextTask.$source.length) {
        //             nextTask.$source.forEach(function (linkId, index) {
        //                 taskNextReset(gantt.getTask(gantt.getLink(linkId).target)); //递归
        //             });
        //         }
        //     })
        // }
        // gantt.attachEvent("onBeforeTaskChanged", function (id, mode, task) {
        //     // console.log(task, task.$source, task.$target);
        //     setTimeout(function () {
        //         taskNextReset(gantt.getTask(id), task);
        //     }, 100)
        //     return true;
        // });

        // 拖动级联子级
        gantt.attachEvent("onBeforeTaskChanged", function (id, mode, task) {
            var oldDate = task.start_date
            if(task.$level===1){
                setTimeout(function(){
                    var newDate = gantt.getTask(id).start_date;
                    gantt.eachTask(function (task) {
                        if(task.parent === id){
                            var sdate = new Date(task.start_date.getTime()+(newDate-oldDate));
                            var edate = gantt.calculateEndDate(sdate, task.duration);
                            task.start_date = sdate;
                            task.end_date = edate;
                        }
                    });
                },100);
            }else if(task.$level === 2){
                setTimeout(function(){
                    // 不满足条件还原
                    var newTask = gantt.getTask(id),newDate = newTask.start_date,flag = true;
                    _self.getConnectedGroup(id).tasks_left.forEach(function(id,index){
                        var pretask = gantt.getTask(id);
                        if(flag && newDate < pretask.end_date){
                            newTask.start_date = task.start_date;
                            newTask.end_date = task.end_date;
                            flag = false;
                            gantt.message('工序《'+task.text+'》的起始时间必须晚于其前驱工序的结束时间。');
                        }
                    });
                    //自动移动右侧task
                    if(flag){
                        _self.getConnectedGroup(id).tasks_right.forEach(function(id,index){
                            var task = gantt.getTask(id);
                            var sdate = new Date(task.start_date.getTime()+(newDate-oldDate));
                            var edate = gantt.calculateEndDate(sdate, task.duration);
                            task.start_date = sdate;
                            task.end_date = edate;
                            gantt.updateTask(id);
                        });
                        //更新pre task
                        _self.fitTasks();
                    }
                },100);
            }
            return true;
        });

        // 拖动任务后 无限加载
        gantt.attachEvent("onAfterTaskDrag", function(id,mode,e){
            setTimeout(() => {
                var range = gantt.getSubtaskDates();
                var scaleUnit = gantt.getState().scale_unit;
                if(range.start_date && range.end_date){
                    var num = -4;
                    if(_self._isPattern){
                        num = 0;
                    }
                    gantt.config.start_date = gantt.calculateEndDate(range.start_date, num, scaleUnit);
                    gantt.config.end_date = gantt.calculateEndDate(range.end_date, 5, scaleUnit);
                    gantt.render();
                }
            }, 200);
         });

        // 鼠标右键 菜单
        gantt.attachEvent("onContextMenu", function (taskId, linkId, event) {
            var x = event.clientX+document.body.scrollLeft+document.documentElement.scrollLeft,
                y = event.clientY+document.body.scrollTop+document.documentElement.scrollTop;
            if (taskId && gantt.getTask(taskId).$level === 2) {
                if(window.confirm('删除任务？')){
                    gantt.deleteTask(taskId);
                }
                return false;
            }
            if(linkId){
                if(window.confirm('删除关系？')){
                    gantt.deleteLink(linkId);
                }
                return false;
            }
            return true;
        });

        // 连线
        gantt.attachEvent("onBeforeLinkAdd", function(id, link){
            if(link.type === "0"){
                var sourceTask = gantt.getTask(link.source);
                var targetTask = gantt.getTask(link.target);
                if(sourceTask.$level !== 2 || targetTask.$level !== 2){
                    return false;
                }
            }else{
                return false;
            }
        });

        // 排序
        gantt.attachEvent('onRowDragEnd',function(id, target){
            _self.fitTasks();
        });
    }
}
