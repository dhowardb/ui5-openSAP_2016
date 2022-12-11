sap.ui.define(
  ["sap/ui/core/mvc/Controller", "sap/m/MessageToast"],
  function (Controller, MessageToast) {
    Controller.extend("opensap.myapp.controller.App", {
      onShowHelloHandler: function () {
        let oBundle = this.getView().getModel("i18n").getResourceBundle();
        let sRecipient = this.getView()
          .getModel("helloPanel")
          .getProperty("/recipient/name");
        let message = oBundle.getText("helloMsg", [sRecipient]);
        MessageToast.show(message);
        console.log("test");
      },
    });
  }
);
