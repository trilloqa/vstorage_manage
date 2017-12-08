/* globals manage */

(function() {

  manage.UploadCSVFilesC = Trillo.inherits(Shared.SharedC, function(viewSpec) {
    Shared.SharedC.call(this, viewSpec);
  });

  var UploadCSVFilesC = manage.UploadCSVFilesC.prototype;
  var SharedC = Shared.SharedC.prototype;

  UploadCSVFilesC.handleAction = function(actionName, selectedObj, $e, targetController) {
    return SharedC.handleAction.call(this, actionName, selectedObj, $e, targetController);
  };

  UploadCSVFilesC.postViewShown = function(view) {
    SharedC.postViewShown.call(this, view);
    this.showView(this.getFileUploadSpec());
  };

  UploadCSVFilesC.attrChanged = function(obj, name, value, oldValue, model) {
    if (name === "clsName") {
      this.controllerByName("FileUpload").setParam("className", value);
    }
  };

  UploadCSVFilesC.getFileUploadSpec = function() {
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
        uploadUrl : "/_rv/uploadCsvFile",
        allowedFileTypes : [ 'csv' ],
        className : "Customer"
      }
    };
  };
})();
