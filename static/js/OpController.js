/* globals manage */

(function() {

  manage.OpC = Trillo.inherits(Shared.SharedC, function(viewSpec) {
    Shared.SharedC.call(this, viewSpec);
  });

  var OpC = manage.OpC.prototype;
  var SharedC = Shared.SharedC.prototype;

  OpC.postProcessModel = function(model) {
    if (model.data.scheduleAt) {
      model.data.scheduleDate = model.data.scheduleTime = model.data.scheduleAt;
    } else {
      var dt = new Date();
      dt.setMinutes(dt.getMinutes() - dt.getMinutes() % 15);
      model.data.scheduleDate = model.data.scheduleTime = dt.getTime();
    }
    if (model.data.task && model.data.task.subTasks) {
      try {
        var l = model.data.task.subTasks;
        for (var i = 0; i < l.length; i++) {
          model.data[l[i].name] = true;
        }
      } catch (exc) {
      }
    }
  };

  OpC.afterPost = function(result, view) {
    SharedC.afterPost.call(this, result, view);
    if (!result._rtag) {
      this.parentController().model().changeObj(result);
    }
  };

})();