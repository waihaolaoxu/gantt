gantt.attachEvent("onTaskDrag", function (id, mode, task, original) {
    var modes = gantt.config.drag_mode;
    if (mode == modes.move) {
        var diff = task.start_date - original.start_date;
        gantt.eachTask(function (child) {
            if (child.$source.length != 0 || child.$target.length != 0) {
                child.start_date = new Date(+child.start_date + diff);
                child.end_date = new Date(+child.end_date + diff);
                gantt.refreshTask(child.id, true);
            }
        }, id);
    }
    return true;
});

// rounds the positions of child items to the scale
// gantt.attachEvent("onAfterTaskDrag", function (id, mode, e) {
//     var modes = gantt.config.drag_mode;
//     if (mode == modes.move) {
//         gantt.eachTask(function (child) {
//             gantt.roundTaskDates(child);
//             gantt.refreshTask(child.id, true);
//         }, id);
//     }
// });
// 

gantt.attachEvent("onTaskDblClick", function (id, e) {
    return true;
})