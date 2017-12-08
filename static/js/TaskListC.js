/* globals manage */

(function() {

  manage.TaskListC = Trillo.inherits(Shared.SharedC, function(viewSpec) {
    Shared.SharedC.call(this, viewSpec);
  });

  var TaskListC = manage.TaskListC.prototype;
  var SharedC = Shared.SharedC.prototype;

  TaskListC.handleAction = function(actionName, selectedObj, $e, targetController) {
    if (actionName == "_row_clicked" && $e.attr("nm") === "completed") {
      this.changeTaskCompletedState(selectedObj, $e.prop('checked'));
      return true;
    } else if (actionName == "_row_clicked" && $e.attr("nm") === "subtaskCompleted") {
      this.changeSubTaskCompletedState(selectedObj, $e.attr("subtask-name"), $e.prop('checked'));
      return true;
    }
    return SharedC.handleAction.call(this, actionName, selectedObj, $e, targetController);
  };

  TaskListC.changeTaskCompletedState = function(selectedObj, state) {
    console.log("changeTaskCompletedState");
    options = {
      url : "/_rv/" + "completedState/" + selectedObj.id + "?completed=" + state,
      contentType : "application/json",
      datatype : "application/json",
      method : "put"
    };

    $.ajax(options).done($.proxy(this.actionDone, this, selectedObj));

  };

  TaskListC.changeSubTaskCompletedState = function(selectedObj, subtaskName, state) {
    console.log("changeSubTaskCompletedState");
    options = {
      url : "/_rv/" + "subTaskCompletedState/" + selectedObj.id + "?completed=" + state + "&name=" + subtaskName,
      contentType : "application/json",
      datatype : "application/json",
      method : "put"
    };

    $.ajax(options).done($.proxy(this.actionDone, this, selectedObj));

  };

  TaskListC.actionDone = function(selectedObj, data) {
    if (!data._rtag && data.id === selectedObj.id) {
      $.extend(selectedObj, data);
      this.view().reRenderView();
    }
  }
})();
