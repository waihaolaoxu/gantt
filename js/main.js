gantt.message("Try to move or resize task to not working time");


/**
 * Marker
 */
var date_to_str = gantt.date.date_to_str(gantt.config.task_date);
var today = new Date(2018, 3, 5);
gantt.addMarker({
    start_date: today,
    css: "today",
    text: "收款",
    title: "Today: " + date_to_str(today)
});

var start = new Date(2018, 2, 28);
gantt.addMarker({
    start_date: start,
    css: "status_line",
    text: "项目开始",
    title: "Start project: " + date_to_str(start)
});


gantt.init("gantt_here");
gantt.parse(demo_tasks);

// var tasks = gantt.getTaskByTime();
// var links = gantt.getLinks();
// console.log('tasks',tasks)
// console.log('links',links)


var fn = {
    //切换施工时间类型
    startType: function (e) {
        switch (e.value) {
        case '0':
            gantt.config.work_time = false;
            break;
        case '1':
            gantt.config.work_time = true;
            break;
        }
        gantt.render();
        gantt.batchUpdate(function () {
            gantt.eachTask(function (task) {
                gantt.updateTask(task.id);
            });
        });
    }
}