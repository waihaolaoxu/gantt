/**
 * 配置
 */
// 初始化开始结束日期及二级工期
setTimeout(() => {
    gantt.config.start_date = gantt.calculateEndDate(gantt.getState().min_date, 1);
    gantt.config.end_date = gantt.calculateEndDate(gantt.getState().max_date, 2);
    gantt.render();
}, 0);

/**
 * 模版
 */

/**
 * 事件
 */


/**
 * 初始化
 */
var ganttData = {
    data:[
        {"id":1000, "text":"和谐家园",type:'project', "open": true},
        {"id":1100, "text":"一阶段 1100","start_date":"24-07-2018","duration":"1","parent":"1000", "open": true},
        {"id":1200, "text":"二阶段 1200","start_date":"24-07-2018","duration":"1","parent":"1000", "open": true},
        {"id":1300, "text":"三阶段 1300","start_date":"24-07-2018","duration":"1","parent":"1000", "open": true},
        
        {"id":1101, "text":"1101", "start_date":"24-07-2018", "duration":"2", "parent":"1100",payload:{rday:1}},
        {"id":1102, "text":"1102", "start_date":"30-07-2018", "duration":"2", "parent":"1100",payload:{rday:1}},
        {"id":1103,"text":"1103","start_date":"26-07-2018","duration":1,"parent":"1100",payload:{rday:1}},
    ],
    links:[
        {"source":"1101","target":"1102","type":"0","id":1532416240797},
        {"source":"1101","target":"1103","type":"0","id":1532416240805},
        {"source":"1103","target":"1102","type":"0","id":1532416240806}
    ]
}
ganttFn.init({
    id:'gantt_here',
    data:ganttData,
    isPattern:true
});
