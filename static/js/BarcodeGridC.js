/* globals manage */

(function() {

  manage.BarcodeGridC = Trillo.inherits(Shared.SharedC, function(viewSpec) {
    Shared.SharedC.call(this, viewSpec);
  });

  var BarcodeGridC = manage.BarcodeGridC.prototype;
  var SharedC = Shared.SharedC.prototype;

  BarcodeGridC.handleAction = function(actionName, selectedObj, $e, targetController) {
    if (actionName === "generateBarcodes") {
      this.generageBarcodes();
      return true;
    } else if (actionName === "closePrintView") {
      this.closePrintView();
      return true;
    } else if (actionName === "printBarcodes") {
      this.printBarcodes();
      return true;
    }
    return SharedC.handleAction.call(this, actionName, selectedObj, $e, targetController);
  };

  BarcodeGridC.generageBarcodes = function() {
    $(".js-non-print-mode").addClass("trillo-display-none");
    $(".js-print-mode").removeClass("trillo-display-none");
    var dt = this.getData();
    var sl = this.$elem().find(".barcode-label");
    var n = 0;
    var v;
    for (var i = 0; i < dt.length; i++) {
      for (var j = 1; j <= 3; j++) {
        v = $.trim(dt[i]["c" + j]);
        if (v) {
          JsBarcode(sl[n], v, {
            format : "code39",
            lineColor : "#000"
          });
        }
        n++;
      }
    }
  };

  BarcodeGridC.closePrintView = function() {
    $(".js-non-print-mode").removeClass("trillo-display-none");
    $(".js-print-mode").addClass("trillo-display-none");
  };

  BarcodeGridC.printBarcodes = function() {
    /*
     * $('.barcode-page').printElement({ printMode : 'popup' });
     */
    this.printElem($('.barcode-page')[0]);
  }

  BarcodeGridC.postViewShown = function(view) {
    SharedC.postViewShown.call(this, view);
  };

  BarcodeGridC.printElem = function(elem) {

    var style = "body {\n" + "  width: 8.5in;\n" + "  height: 11.0in;\n" + "  margin: 0;\n" + "}\n";

    style += ".barcode-inner-div {\n" + "  width: 8.5in;\n" + "  height: 10.0in;\n" + "  position: relative;\n"
        + "  top: 0.5in;\n" + "}\n";

    style += ".barcode-label {\n" + "  width: 2.025in;\n" + "  height: 1.0in;\n" + "  padding: 0in .3in 0;\n"
        + "  margin-left: .0625in;\n" + "  margin-right: .0625in;\n" + "  display: inline-block;\n"
        + "  text-align: center;\n" + "  overflow: hidden;\n" + "  box-sizing: content-box;\n"
        + "  margin-top: -4px;\n" + "}\n";

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
