/* globals manage */

(function() {

  manage.OpVehicleListC = Trillo.inherits(Shared.SharedC, function(viewSpec) {
    Shared.SharedC.call(this, viewSpec);
    this.filterChangedM = $.proxy(this.filterChanged, this);
    this.myFilterView = null;
  });

  var OpVehicleListC = manage.OpVehicleListC.prototype;
  var SharedC = Shared.SharedC.prototype;

  OpVehicleListC.handleAction = function(actionName, selectedObj, $e, targetController) {
    if (actionName == "_row_clicked" && $e.attr("nm") === "completed") {
      this.completeOp(selectedObj, $e.prop('checked'));
      return true;
    }
    return SharedC.handleAction.call(this, actionName, selectedObj, $e, targetController);
  };

  OpVehicleListC.postViewSetup = function(view) {
    SharedC.postViewSetup.call(this, view);
    var state = this.viewSpec.state || {};
    this.$elem().addClass("op-" + state.op + "-on");
    var spec = {
      name : "OpVehicleListFilter",
      type : Trillo.ViewType.Form,
      elementSelector : '[nm="OpVehicleListFilter"]',
      controller : "Trillo.FileUploadC",
      data : {
        status : state.status ? state.status : "all"
      }
    };
    var self = this;
    this.showView(spec).done(function(view) {
      self.myFilterView = view;
    });
  };

  OpVehicleListC.attrChanged = function(obj, name, value, oldValue, model) {
    if (name === "status" || name === "buildingNumber") {
      this.view().reRenderView(true);
    } else {
      var state = this.viewSpec.state || {};
      if (state.op === "checkin") {
        if (value && name === "location") {
          this.completeOp(obj, true, value);
        }
      }
    }
  };

  OpVehicleListC.updateApiSpec = function(apiSpec) {
    var v = this.myFilterView.getFieldValue("status");
    var filter = "";
    if (v === "availableForCheckin") {
      filter = "(status = '2' or status = '6')";
    } else if (v === "availableForCheckout") {
      filter = "status = '1' or status = '3'";
    } else if (v === "availableForPreCheckout") {
      filter = "(status = '1' or status = '3')";
    } else if (v === "availableForRelocate") {
      filter = "(status = '1' or status = '3')";
    } else if (v === "availableResumeStorage") {
      filter = "status = '5'";
    }
    v = this.myFilterView.getFieldValue("buildingNumber");
    if (v) {
      filter += (filter.length ? " and " : "") + "(buildingNumber='" + v + "')";
    }
    apiSpec.body.where = filter;
  };

  OpVehicleListC.completeOp = function(selectedObj, value, location) {
    console.log("completeOp");
    var state = this.viewSpec.state || {};
    options = {
      url : "/_rv/" + "completeOp/" + state.op + "/" + selectedObj.id + "?completed=" + value
          + (location ? "&location=" + location : ""),
      contentType : "application/json",
      datatype : "application/json",
      method : "put"
    };

    $.ajax(options).done($.proxy(this.completeOpDone, this, selectedObj, value));

  };

  OpVehicleListC.completeOpDone = function(selectedObj, value, data) {
    if (!data._rtag && data.id === selectedObj.id) {
      $.extend(selectedObj, data);
      selectedObj.completed = value;
      this.view().reRenderView();
    }
  }

})();
