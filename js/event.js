// gantt.attachEvent("onTaskDrag", function (id, mode, task, original) {
//     var modes = gantt.config.drag_mode;
//     if (mode == modes.move) {
//         var diff = task.start_date - original.start_date;
//         gantt.eachTask(function (child) {
//             if (child.$source.length != 0 || child.$target.length != 0) {
//                 child.start_date = new Date(+child.start_date + diff);
//                 child.end_date = new Date(+child.end_date + diff);
//                 gantt.refreshTask(child.id, true);
//             }
//         }, id);
//     }
//     return true;
// });

// rounds the positions of child items to the scale
// gantt.attachEvent("onTaskDrag", function (id, mode, e) {
//     var modes = gantt.config.drag_mode;
//     if (mode == modes.move) {
//         gantt.eachTask(function (child) {
//             console.log(22)
//             gantt.roundTaskDates(child);
//             gantt.refreshTask(child.id, true);
//         }, id);
//     }
// });


gantt.attachEvent("onTaskDblClick", function (id, e) {
    return true;
});


/**
 * 任务拖动逻辑处理
 * 拖动只级联右侧关联的，前面的判断间隔，如果不满足直接退回
 */
function taskNextReset(task,oldTask){ //可以用old还原
     var startdate = new Date(task.end_date.getTime()+1000*60*60*24);
     task.$source.forEach(function(linkId,index){
        var nextId = gantt.getLink(linkId).target;//下一个task id
        var nextTask = gantt.getTask(nextId);//下一个task
        var enddate = gantt.calculateEndDate(startdate,nextTask.duration);
        nextTask.end_date = enddate;
        nextTask.start_date = startdate;
        gantt.updateTask(nextId);
        if(nextTask.$source.length){
            task.$source.forEach(function(linkId,index){
                taskNextReset(gantt.getTask(gantt.getLink(linkId).target));//递归
            });
        }
    })
}

gantt.attachEvent("onBeforeTaskChanged", function(id, mode, task){
    console.log(task,task.$source,task.$target);
    setTimeout(function(){
        taskNextReset(gantt.getTask(id),task);
    },100)
    return true;
});