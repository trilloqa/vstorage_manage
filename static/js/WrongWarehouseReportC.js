/* globals manage */

(function() {

  manage.WrongWarehouseReportC = Trillo.inherits(Shared.SharedC, function(viewSpec) {
    Shared.SharedC.call(this, viewSpec);
  });

  var WrongWarehouseReportC = manage.WrongWarehouseReportC.prototype;
  var SharedC = Shared.SharedC.prototype;

  WrongWarehouseReportC.getWhereClause = function() {
    var s1 = this._view.getWhereClause();
    var v = this.view().filterView.getFieldValue("scanBuildingNumber");
    return "(buildingNumber !='" + v + "') and " + s1;
  };
})();
