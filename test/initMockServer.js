sap.ui.define(["../localService/mockServer"], function (mockServer) {
  //initialize the mockServer

  mockServer.init();

  //initialize the embedded component
  sap.ui.require(["sap/ui/core/ComponentSupport"]);
});
