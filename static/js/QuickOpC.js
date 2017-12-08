/* globals manage */

(function() {

  manage.QuickOpC = Trillo.inherits(Shared.SharedC, function(viewSpec) {
    Shared.SharedC.call(this, viewSpec);
  });

  var QuickOpC = manage.QuickOpC.prototype;
  var SharedC = Shared.SharedC.prototype;

  QuickOpC.attrChanged = function(obj, name, value, oldValue, model) {
    if (name === "scannedVehicleId") {
      var vehicleId = $.trim(value);
      if (!vehicleId) {
        return;
      }
      this.doSearch(vehicleId);
    } else if (name === "scannedLocation") {
      var data = this.getData();
      var vehicleId = data.id;
      if (!vehicleId) {
        this.resetForm(3);
        return;
      }
      var location = $.trim(value);
      if (!location) {
        return;
      }
      this.completeOp(data, location);
    } else {
      $(".js-default-focus", this.$elem()).focus();
    }
  };

  QuickOpC.completeOp = function(selectedObj, location) {
    console.log("completeOp");
    var state = this.viewSpec.state || {};
    options = {
      url : "/_rv/" + "completeOp/" + state.op + "/" + selectedObj.id + "?completed=true"
          + (location ? "&location=" + location : ""),
      contentType : "application/json",
      datatype : "application/json",
      method : "put"
    };

    $.ajax(options).done($.proxy(this.completeOpDone, this));

  };

  QuickOpC.completeOpDone = function(data) {
    if (!data._rtag) {
      this.model().setData({});
      this.resetForm(3);
    }
  }

  QuickOpC.doSearch = function(vehicleId) {
    console.log("doSearch");
    var query = "vehicleId='" + vehicleId + "'";
    options = {
      url : "/ds/objectsbyquery/manage/rv/Vehicle?query=" + query,
      contentType : "application/json",
      datatype : "application/json"
    };
    $.ajax(options).done($.proxy(this.searchDone, this));
  };

  QuickOpC.searchDone = function(data) {
    var data;
    if (data.length) {
      data = data[0];
      data.scannedVehicleId = data.vehicleId;
    } else {
      data = {};
    }
    this.model().setData(data);
    this.$elem().find(".post-search-elements").removeClass("trillo-display-none");
    if (!this.checkError()) {
      this.clearError();
      this.$elem().find(".location-field").removeClass("trillo-display-none");
      this.resetForm(1);
    } else {
      this.$elem().find(".location-field").addClass("trillo-display-none");
      this.resetForm(4);
    }

  };

  QuickOpC.resetForm = function(mode) {
    this.model().setValueQuiet("scannedVehicleId", "");
    this.view().setFieldValue("scannedVehicleId", "")
    if (mode === 1 || mode === 3) {
      this.model().setValueQuiet("scannedLocation", "");
      this.view().setFieldValue("scannedLocation", "");
    }
    if (mode === 2 || mode === 3) {
      this.$elem().find(".post-search-elements").addClass("trillo-display-none");
      this.$elem().find(".location-field").addClass("trillo-display-none");
      this.clearError();
    }
    if (mode !== 1) {
      $(".js-default-focus", this.$elem()).focus();
    } else {
      this.$elem().find('[nm="scannedLocation"]').focus();
    }
  };

  QuickOpC.checkError = function(mode) {
    this.clearError();
    var state = this.viewSpec.state || {};
    var data = this.getData();
    var error = false;
    var $e = this.$elem();
    if (!data.id) {
      $e.find('[name="invalid-vehicle-id-msg"]').removeClass("trillo-display-none");
      error = true;
    } else if (data.status === "4") {
      $e.find('[name="inactive-status-msg"]').removeClass("trillo-display-none");
      error = true;
    } else if (data.status === "5") {
      $e.find('[name="long-term-out-msg"]').removeClass("trillo-display-none");
      error = true;
    } else if ((data.status !== "1" && state.op === "relocate") || (data.status !== "2" && state.op === "checkin")) {
      $e.find('[name="invalid-status-msg"]').removeClass("trillo-display-none");
      error = true;
    }
    if (error) {
      this.$elem().find(".error-msg-container").removeClass("trillo-display-none");
    }
    return error;
  }

  QuickOpC.clearError = function(mode) {
    this.$elem().find(".error-msg-container").addClass("trillo-display-none");
    this.$elem().find(".op-error-msg").addClass("trillo-display-none");
  }

})();
