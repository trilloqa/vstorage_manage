/* globals manage */

(function() {

  manage.VehicleC = Trillo.inherits(Shared.SharedC, function(viewSpec) {
    Shared.SharedC.call(this, viewSpec);
    this.labelWidth = 2.625;
    this.labelMargin = 0.0625;
    this.labelHeight = 1;
  });

  var VehicleC = manage.VehicleC.prototype;
  var SharedC = Shared.SharedC.prototype;

  VehicleC.postProcessModel = function(model) {
    if (!model.data.buildingNumber) {
      model.data.buildingNumber = "0";
    }
    model.data.barcodeRow = "1";
    model.data.barcodeCol = "1";
  }

  VehicleC.afterPost = function(result, view) {
    SharedC.afterPost.call(this, result, view);
    if (view.name != "PreCheckoutForm3" && !result._rtag) {
      if (this.getParam("cf")) {
        this.setRoute("customer;id=" + result.parentId);
      } else {
        history.back();
      }
    }
  };

  VehicleC.postViewShown = function(view) {
    $(".js-barcode-mode").addClass("trillo-display-none");
    $("body").removeClass("barcode-mode");
    this.statusChanged();
  };

  VehicleC.attrChanged = function(obj, name, value, oldValue, model) {
    SharedC.attrChanged.call(this, obj, name, value, oldValue, model);
    if (name === "status") {
      this.statusChanged();
    } else if (name === "printLicense" || name === "printCF") {
      this.generageBarcode();
    }
  };

  VehicleC.statusChanged = function() {
    var d = this.getData();
    var st = d.status + "";
    if (st === "3") {
      if (!d.scheduleAt) {
        var dt = new Date();
        dt.setMinutes(dt.getMinutes() - dt.getMinutes() % 15);
        d.scheduleAt = dt.getTime();
      }
      this.$elem().find(".schedule-at-row").removeClass("trillo-display-none");
    } else {
      this.$elem().find(".schedule-at-row").addClass("trillo-display-none");
      delete d.scheduleAt;
    }

    if (st === "3" || st === "1") {
      this.$elem().find(".pre-checkout-action-row").removeClass("trillo-display-none");
    } else {
      this.$elem().find(".pre-checkout-action-row").addClass("trillo-display-none");
    }

  };

  VehicleC.objChanged = function(obj) {
    SharedC.objChanged.call(this, obj);
    this.statusChanged();
  };

  VehicleC.handleAction = function(actionName, selectedObj, $e, targetController) {
    if (actionName === "showBarcodeForm") {
      $(".js-barcode-mode").removeClass("trillo-display-none");
      $("body").addClass("barcode-mode");
      this.generageBarcode();
      return true;
    } else if (actionName === "closeBarcodeForm") {
      $(".js-barcode-mode").addClass("trillo-display-none");
      $("body").removeClass("barcode-mode");
      return true;
    } else if (actionName === "printBarcodeForm") {
      this.printBarcodes();
      return true;
    }
    return SharedC.handleAction.call(this, actionName, selectedObj);
  };

  VehicleC.generageBarcode = function() {
    var dt = this.getData();
    var sl = this.$elem().find(".barcode-label");
    var text = dt.vehicleId;
    if (dt.printLicense && dt.license) {
      text += " " + dt.license;
    }
    if (dt.printCF && dt.cfNumber) {
      text += " " + dt.cfNumber;
    }
    JsBarcode(sl[0], dt.vehicleId, {
      format : "code39",
      lineColor : "#000",
      text : text,
      fontSize : 15
    });
  };

  VehicleC.printBarcodes = function() {
    var dt = this.getData();
    var $e = $('.barcode-div').clone(true);
    var $svg = $e.find(".barcode-label");
    var r = parseInt(dt.barcodeRow, 10);
    var c = parseInt(dt.barcodeCol, 10);
    var x = this.labelWidth * (c - 1) + this.labelMargin * (c * 2 - 1);
    var y = this.labelHeight * (r - 1);
    $svg.css("margin-left", x + "in");
    $svg.css("margin-top", y + "in");
    this.printElem($e[0]);
  }

  VehicleC.printElem = function(elem) {

    var style = "body {\n" + "  width: 8.5in;\n" + "  height: 11.0in;\n" + "  margin: 0;\n" + "}\n";

    style += ".barcode-inner-div {\n" + "  width: 8.5in;\n" + "  height: 10.0in;\n" + "  position: relative;\n"
        + "  top: 0.5in;\n" + "}\n";

    style += ".barcode-label {\n" + "  width: 2.025in;\n" + "  height: 1.0in;\n" + "  padding: 0in .3in 0;\n"
        + "  display: inline-block;\n" + "  text-align: center;\n" + "  overflow: hidden;\n"
        + "  box-sizing: content-box;\n" + "  margin-top: -4px;\n" + "}\n";

    style += "@page {\n" + "  size: auto;\n" + "  margin: 0mm 0mm 0mm 0mm;\n" + "}\n";

    var mywindow = window.open('', 'PRINT', 'height=1056px,width=816px');
    mywindow.document.write('<html><head><title>' + document.title + '</title>');
    mywindow.document.write('</head><style>');
    mywindow.document.write(style);
    mywindow.document.write('</style></head><body class="barcode-page">');
    mywindow.document.write(elem.innerHTML);
    mywindow.document.write('</body></html>');
    mywindow.document.close(); // necessary for IE >= 10
    mywindow.focus(); // necessary for IE >= 10*/
    mywindow.print();
    mywindow.close();
    return true;
  }

})();
