/* globals manage */

(function() {

  manage.CustomerC = Trillo.inherits(Shared.SharedC, function(viewSpec) {
    Shared.SharedC.call(this, viewSpec);
    this.addVehicle = false;
  });

  var CustomerC = manage.CustomerC.prototype;
  var SharedC = Shared.SharedC.prototype;

  CustomerC.handleAction = function(actionName, selectedObj, $e, targetController) {
    if (!this.getData().id && actionName === "newVehicle") {
      this.addVehicle = true;
      SharedC.ok.call(this, "ok");
      return true;
    }
    return SharedC.handleAction.call(this, actionName, selectedObj, $e, targetController);
  };

  CustomerC.postViewShown = function(view) {
    SharedC.postViewShown.call(this, view);
  };

  CustomerC.ok = function(actionName) {
    this.addVehicle = false;
    SharedC.ok.call(this, actionName);
  };

  CustomerC.afterPost = function(result, view) {
    SharedC.afterPost.call(this, result, view);
    if (!result._rtag && this.addVehicle) {
      this.addVehicle = false;
      this.setRoute("newVehicle;;cf=1;parentId=" + result.id);
    }
  };
})();
