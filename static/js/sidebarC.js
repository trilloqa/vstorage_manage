/* globals manage */

(function() {

  manage.sidebarC = Trillo.inherits(Shared.SharedC, function(viewSpec) {
    Shared.SharedC.call(this, viewSpec);
  });

  var sidebarC = manage.sidebarC.prototype;
  var SharedC = Shared.SharedC.prototype;

  sidebarC.handleClickGeneric = function($e) {
    if (this.currentSelectionUpdated("", $e, true)) {
      return true;
    }
    return SharedC.handleClickGeneric.call(this, $e);
  };

  sidebarC.handleAction = function(actionName, selectedObj, $e, targetController) {
    return SharedC.handleAction.call(this, actionName, selectedObj, $e, targetController);
  };

  sidebarC.currentSelectionUpdated = function(routeSpecArr, $e, userAction) {
    var $e2 = $e.closest(".navigation__sub");
    if ($e2.length) {
      var parentToggles = $e.parent()[0] == $e2[0];
      if (parentToggles) {
        // close other open menus.
        this.$elem().find(".navigation__sub--toggled").removeClass("navigation__sub--toggled").children('ul')
            .slideToggle(0);
        // returns true since there is not specific navigation attached i.e.
        // when the clicked element simply opens the submenu
        $e2.toggleClass('navigation__sub--toggled');
        $e.next('ul').slideToggle(250);
        return true;
      } else {
        if (!$e2.hasClass('navigation__sub--toggled')) {
          // close other open menus.
          this.$elem().find(".navigation__sub--toggled").removeClass("navigation__sub--toggled").children('ul')
              .slideToggle(0);
          $e2.toggleClass('navigation__sub--toggled');
          $e2.children('ul').slideToggle(250);
        }
      }
    }
    return false;
  }
})();
