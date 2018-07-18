/**
 * 提示层模版
 */
gantt.templates.tooltip_text = function(start,end,task){
    return "<b>任务:</b> "+task.text+"<br/><b>开始时间:</b> " + 
    gantt.templates.tooltip_date_format(start)+ 
    "<br/><b>结束时间:</b> "+gantt.templates.tooltip_date_format(end);
};

/**
 * 任务弹层配置
 */
gantt.templates.lightbox_header = function(start_date,end_date,task){
    return '编辑'
    // return gantt.templates.task_time(task.start_date, task.end_date, task)  +  "&nbsp;" +
    // (gantt.templates.task_text(task.start_date, task.end_date, task) || "").substr(0, 70);
};

/**
 * 周末底色设置
 */
gantt.templates.task_cell_class = function (task, date) {
    if (!gantt.isWorkTime(date))
        return "week_end";
    return "";
};

/**
 * 任务条颜色
 */
gantt.templates.task_class = function(start, end, task){
    if(new Date(task.start_date)>new Date()){
        return 'state01';
    }
    return ''
};