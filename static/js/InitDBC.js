/* globals manage */

(function() {

  manage.InitDBC = Trillo.inherits(Shared.SharedC, function(viewSpec) {
    Shared.SharedC.call(this, viewSpec);
  });

  var InitDBC = manage.InitDBC.prototype;
  var SharedC = Shared.SharedC.prototype;

  InitDBC.handleAction = function(actionName, selectedObj, $e, targetController) {
    if (actionName === "initDB") {
      this.ok();
    }
    return SharedC.handleAction.call(this, actionName, selectedObj, $e, targetController);
  };

  InitDBC.beforePost = function(data, view) {
    var f = SharedC.beforePost.call(this, data, view);
    if (f && view === this.view()) {
      var $e = this.$elem();
      $e.find('[nm="initDB"]').addClass("trillo-display-none");
      $e.find(".row-1, .row-2").addClass("trillo-display-none");
      $e.find(".row-3").removeClass("trillo-display-none");
    }
    return f;
  };

  InitDBC.afterPost = function(result, view) {
    var $e = this.$elem();
    $e.find(".row-3").addClass("trillo-display-none");
    if (result.status === "failed") {
      $e.find(".row-5").removeClass("trillo-display-none");
      $e.find(".failed-msg").html(result.message || result.status);

      SharedC.afterPost.call(this, result, view);
    } else {
      $e.find(".row-4").removeClass("trillo-display-none");
    }
  };

  InitDBC.postViewShown = function(view) {
    SharedC.postViewShown.call(this, view);
  };
})();
