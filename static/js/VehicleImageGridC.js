/* globals manage */
/* globals lightGallery */
(function() {

  manage.VehicleImageGridC = Trillo.inherits(Trillo.DocGridC, function(viewSpec) {
    Trillo.DocGridC.call(this, viewSpec);
  });

  var VehicleImageGridC = manage.VehicleImageGridC.prototype;
  var DocGridC = Trillo.DocGridC.prototype;

  VehicleImageGridC.postViewShown = function(view) {
    DocGridC.postViewShown.call(this, view);
    this.$elem().find(".js-grid").lightGallery({
      fullScreen : false
    });
  };

  VehicleImageGridC.handleAction = function(actionName, selectedObj, $e, targetController) {
    return DocGridC.handleAction.call(this, actionName, selectedObj, $e, targetController);
  };

  VehicleImageGridC.getFileUploadSpec = function() {
    if (this.$elem().find(".js-file-upload").length === 0) {
      return null;
    }
    return {
      name : "FileUpload",
      type : Trillo.ViewType.Default,
      elementSelector : ".js-file-upload",
      controller : "Trillo.FileUploadC",
      data : {
        fileName : "a"
      },
      params : {
        targetViewName : this.viewSpec.name,
        folder : this.appCtx().orgName + "/" + this.appCtx().appName + "/vehicle_images",
        uploadUrl : "/_service/doc/upload",
        fileNamePrefix : this.viewSpec.params.vehicleId,
        parentUid : "Vehicle-" + this.viewSpec.params.id,
        className : "Doc"
      }
    };
  };

})();
