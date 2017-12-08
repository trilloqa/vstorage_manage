/* globals manage */

(function() {

  manage.RecordedInventoryListC = Trillo.inherits(Shared.SharedC, function(viewSpec) {
    Shared.SharedC.call(this, viewSpec);
  });

  var RecordedInventoryListC = manage.RecordedInventoryListC.prototype;
  var SharedC = Shared.SharedC.prototype;

  RecordedInventoryListC.handleAction = function(actionName, selectedObj, $e, targetController) {
    if (actionName === "clearRecordedInventory") {
      this.doDelete();
      return true;
    }
    return SharedC.handleAction.call(this, actionName, selectedObj, $e, targetController);
  };

  RecordedInventoryListC.postViewShown = function(view) {
    SharedC.postViewShown.call(this, view);
  };

  RecordedInventoryListC.doDelete = function(obj) {
    var options = {
      ok : $.proxy(this._doDelete, this, obj)
    };
    Trillo.showModal("Clear Recorded Inventory", "Are you sure you want to delete the recorded inventory?", options);
  };

  RecordedInventoryListC._doDelete = function(obj) {
    var whereClause = this.view().getWhereClause();
    $.ajax({
      url : "/_rv/clearRecordedInventory",
      type : 'delete',
      data : Trillo.stringify({
        where : whereClause
      }),
      contentType : "application/json"
    }).done($.proxy(this._doDeleteSucceeded, this, obj));
  };

  RecordedInventoryListC._doDeleteSucceeded = function(obj, result) {
    if (result.failed) {
      Trillo.log.error(result.message);
    } else {
      this.view().reRenderView(true);
    }
  };
})();
