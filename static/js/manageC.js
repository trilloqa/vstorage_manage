/* globals manage */

(function() {

  manage.manageC = Trillo.inherits(Shared.AppC, function(viewSpec) {
    Shared.AppC.call(this, viewSpec);
    $('body').on('change', '.theme-switch input:radio', function() {
      var theme = $(this).val();
      Trillo.navHistory.setItemByKey("VStorage.manage.theme." + Trillo.appContext.user.userId, theme);
      $('body').attr('data-ma-theme', theme);
    });
  });

  var manageC = manage.manageC.prototype;
  var AppC = Shared.AppC.prototype;

  manageC.handleAction = function(actionName, selectedObj, $e, targetController) {
    if (actionName === "toggleSideBar") {
      $(".left-column").toggleClass("toggled");
      $e.toggleClass("toggled");
      return true;
    }
    return AppC.handleAction.call(this, actionName, selectedObj);
  };
})();
