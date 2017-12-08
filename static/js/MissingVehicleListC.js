/* globals manage */

(function() {

  manage.MissingVehicleListC = Trillo.inherits(Shared.SharedC, function(viewSpec) {
    Shared.SharedC.call(this, viewSpec);
  });

  var MissingVehicleListC = manage.MissingVehicleListC.prototype;
  var SharedC = Shared.SharedC.prototype;

  MissingVehicleListC.updateApiSpec = function(apiSpec) {
    var sql = "select t1.* from vehicle_tbl t1 left join inventoryrecord_tbl t2 on t1.vehicleId = t2.vehicleId ";
    sql += "where t2.vehicleId is null and t1.status = '1' and t1.tenantId = '###tenantId###' ";

    var v = this.view().filterView.getFieldValue("buildingNumber");
    if (v) {
      sql += " and (t1.buildingNumber = '" + v + "') ";
    }
    sql += "group by t1.vehicleId";
    apiSpec.body.sql = sql;
  };
})();
