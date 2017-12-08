/* globals manage */

(function() {

  manage.ScanFormC = Trillo.inherits(Shared.SharedC, function(viewSpec) {
    Shared.SharedC.call(this, viewSpec);
  });

  var ScanFormC = manage.ScanFormC.prototype;
  var SharedC = Shared.SharedC.prototype;

  ScanFormC.handleAction = function(actionName, selectedObj, $e, targetController) {
    if (actionName === "continue") {
      var $t = this.$elem();
      this.scanBuildingNumber = this.view().getFieldValue("scanBuildingNumber");
      this.scanBuildingName = this.viewCtx().getEnumName("building-type", this.scanBuildingNumber);
      $e.addClass("trillo-display-none");
      $t.find(".building-name").html(this.scanBuildingName);
      $t.find(".building-name-title").removeClass("trillo-display-none");
      $t.find(".building-row").addClass("trillo-display-none");
      $t.find(".vehicle-row").removeClass("trillo-display-none");
    }
    return SharedC.handleAction.call(this, actionName, selectedObj, $e, targetController);
  };

  ScanFormC.postViewShown = function(view) {
    SharedC.postViewShown.call(this, view);
  };

  ScanFormC.attrChanged = function(obj, name, value, oldValue, model) {
    if (name === "scannedVehicleId") {
      var vehicleId = $.trim(value);
      if (!vehicleId) {
        return;
      }
      this.recordInventory(vehicleId, this.scanBuildingNumber);
    } else {
      $(".js-default-focus", this.$elem()).focus();
    }
  };

  ScanFormC.recordInventory = function(vehicleId, b) {
    console.log("recordInventory");
    var body = {
      scanBuildingNumber : b
    };
    options = {
      url : "/_rv/" + "recordInventory/" + vehicleId,
      contentType : "application/json",
      datatype : "application/json",
      method : "put",
      data : Trillo.stringify(body)
    };

    $.ajax(options).done($.proxy(this.recordInventoryCompletedStateDone, this));

  };

  ScanFormC.recordInventoryCompletedStateDone = function(data) {
    if (!data._rtag) {
      this.model().setData(data);
      this.$elem().find(".scan-form-vehicle-detail").removeClass("trillo-display-none");
    }
  }

  ScanFormC.doSearch = function(vehicleId) {
    console.log("doSearch");
    var query = "vehicleId='" + vehicleId + "'";
    options = {
      url : "/ds/objectsbyquery/manage/rv/Vehicle?query=" + query,
      contentType : "application/json",
      datatype : "application/json"
    };
    $.ajax(options).done($.proxy(this.searchDone, this));
  };

  ScanFormC.searchDone = function(data) {
    this.view().setFieldValue("scannedVehicleId", "");
    if (data.length === 0) {
      return;
    }
    this.model().setData(data[0]);
    this.$elem().find(".scan-form-vehicle-detail").removeClass("trillo-display-none");
  }
})();
