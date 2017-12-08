/* globals manage */

(function() {

  manage.TaskC = Trillo.inherits(Shared.SharedC, function(viewSpec) {
    Shared.SharedC.call(this, viewSpec);
    this.usersInitialized = false;
  });

  var TaskC = manage.TaskC.prototype;
  var SharedC = Shared.SharedC.prototype;

  TaskC.handleAction = function(actionName, selectedObj, $e, targetController) {
    return SharedC.handleAction.call(this, actionName, selectedObj);
  };

  TaskC.postProcessModel = function(model) {
    if (model.data.subTasks) {
      try {
        var l = $.parseJSON(model.data.subTasks);
        var vl = [];
        for (var i = 0; i < l.length; i++) {
          vl.push({
            name : l[i].name,
            value : l[i].status
          });
        }
        model.data.subTasksList = vl;
      } catch (exc) {
      }
    }
  };

  TaskC.attrChanged = function(obj, name, value, oldValue, model) {
    SharedC.attrChanged.call(this, obj, name, value, oldValue, model);
    if (name === "status") {
      this.model().setValueQuiet("completed", value === "4");
    } else if (name === "assignedTo") {
      var $e = this.$elem().find('[nm="assignedTo"]');
      this.model().setValueQuiet("assignedToUserName", $("option:selected", $e).text());
    }
  };

  TaskC.postViewShown = function(view) {
    this.loadUsers();
  };

  TaskC.loadUsers = function() {
    console.log("loadUsers");

    if (this.usersInitialized) {
      return;
    }

    this.usersInitialized = true;

    var body = {
      "className" : "User",
      "start" : 1,
      "size" : 1000,
      "orderBy" : "userId"
    }

    options = {
      url : "/ds/page/auth/vault",
      contentType : "application/json",
      datatype : "application/json",
      method : "post",
      data : Trillo.stringify(body)
    };

    $.ajax(options).done($.proxy(this.loadUsersDone, this));

  };

  TaskC.loadUsersDone = function(data) {
    var $e = this.$elem().find('[nm="assignedTo"]');
    var v = this.model().getValue("assignedTo");
    if (v === null) {
      v = 0;
    }
    if (!data.items) {
      data.items = [];
    }
    data.items.push({
      id : 0,
      userId : "None"
    });
    Trillo.setSelectOptions($e, data.items, "userId", "id", v);
  }
})();
