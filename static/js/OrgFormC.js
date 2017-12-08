/* globals manage */

(function() {

  manage.OrgFormC = Trillo.inherits(Shared.SharedC, function(viewSpec) {
    Shared.SharedC.call(this, viewSpec);
  });

  var OrgFormC = manage.OrgFormC.prototype;
  var SharedC = Shared.SharedC.prototype;

  OrgFormC.postProcessModel = function(model) {
    var dt = model.data;
    if (!model.data.colorTheme) {
      model.data.colorTheme = "green";
    }
  };

  OrgFormC.postViewShown = function(view) {
    var theme = this.getData().colorTheme;
    if (theme) {
      this.$elem().find("label.active").removeClass("active");
      this.$elem().find(".bg-" + theme).addClass("active");
    }
  };

  OrgFormC.handleAction = function(actionName, selectedObj, $e, targetController) {
    return SharedC.handleAction.call(this, actionName, selectedObj);
  };
})();
