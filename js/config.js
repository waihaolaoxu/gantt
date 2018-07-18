/**
 * 配置
 */
gantt.config.show_progress = false;//是否显示进度
gantt.config.work_time = false;//是否只在工作日施工
gantt.config.correct_work_time = true;//工作日
gantt.config.scale_unit = "day"; //表头日期类型
gantt.config.date_scale = "%d";//表头日期显示
gantt.config.min_column_width = 60;//单元格最小宽度
gantt.config.duration_unit = "day";
gantt.config.scale_height = 26*2; //表头高度
gantt.config.row_height = 26; //行高
gantt.config.lightbox.sections = [
    {name:"description", height:40, map_to:"text", type:"textarea", focus:true},
    {name: "type", type: "typeselect", map_to: "type"},                             
    {name: "time",height:40,type: "duration", map_to: "auto"}
];