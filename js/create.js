/**
 * 配置
 */

/**
 * 模版
 */

/**
 * 初始化
 */
var ganttData = {
    data:[
        {"id":1000, "text":"和谐家园",type:'project', "open": true},
        {"id":1100, "text":"一阶段","start_date":"24-07-2018","duration":"1","parent":"1000", "open": true},
        {"id":1200, "text":"二阶段","start_date":"24-07-2018","duration":"1","parent":"1000", "open": true},
        {"id":1300, "text":"三阶段","start_date":"24-07-2018","duration":"1","parent":"1000", "open": true},
        
        {"id":1101, "text":"开工大吉1", "start_date":"23-07-2018", "duration":"4", "parent":"1100"},
        {"id":1102, "text":"开工大吉2", "start_date":"24-07-2018", "duration":"4", "parent":"1100"},
        // {"id":1102, "text":"墙体改造", "start_date":"07-07-2018", "duration":"4", "parent":"1100","open": true},
        // {"id":1103, "text":"水路试压", "start_date":"12-07-2018", "duration":"4", "parent":"1100","open": true},

        // {"id":5, "text":"铺砖", "start_date":"11-07-2018", "duration":"4", "parent":"1200","open": true},
        // {"id":6, "text":"刷墙", "start_date":"13-07-2018", "duration":"8", "parent":"1200","open": true}
    ]
}
ganttFn.init({
    id:'gantt_here',
    data:ganttData,
    isPattern:true
});
