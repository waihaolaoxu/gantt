/**
 * 配置
 */
// gantt.config.readonly = true;//只读模式
gantt.config.static_background = true;
gantt.config.show_progress = false;//是否显示进度
gantt.config.work_time = false;//是否只在工作日施工
gantt.config.correct_work_time = true;//工作日
gantt.config.min_column_width = 60;//单元格最小宽度
gantt.config.duration_unit = "day";
gantt.config.row_height = 26; //行高
gantt.config.fit_tasks = true;//拖动任务重绘
gantt.config.lightbox.sections = [
    {name:"description", height:40, map_to:"text", type:"textarea", focus:true},
    {name: "type", type: "typeselect", map_to: "type"},                             
    {name: "time",height:40,type: "duration", map_to: "auto"}
];
gantt.config.rtl = true;
gantt.config.scale_unit = "month";
gantt.config.date_scale = "%Y年 %F";
gantt.config.scale_height = 50;
gantt.config.subscales = [
    {unit: "day", step: 1, date: "%j",template:function(e){
        return 0 == e.getDay() || 6 == e.getDay() ? ("<div class='weekend-flag-box' style='background: #EFF5FD;line-height: 23px;'>" + e.getDate() + "<div class='weekend-shadow'></div></div>") : e.getDate();
    }}
];
gantt.config.columns = [
    // { name: "wbs", label: "WBS", width: 40, template:function(e){
    //     // console.log(e.id)
    // }},
    { name: "text", label: "阶段及工序名称", width: "160", tree: true,resize:true},
    {
        name: "add22",
        label: "",
        width: 30,
        template: function (e) {
            if(1 == e.$level){
                return '<div class="gantt_add" title="增加工序" ><span class="bv-add-btn">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span></div>'
            }
            return '';
        }
    },
    { name: "start_date", label: "开始时间", width:'80', align: "center" },
    { name: "duration", label: "天数", align: "center" },
    // {name:"add",label:"操作"}
];