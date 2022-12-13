sap.ui.define(
  ["sap/ui/core/util/MockServer", "sap/base/util/UriParameters"],
  function (MockServer, UriParameters) {
    return {
      init: function () {
        //create server
        let mockServer = new MockServer({
          rootUri: "/destinations/ES5/sap/opu/odata/IWBEP/GWSAMPLE_BASIC/",
        });

        let uriParameters = new UriParameters(window.location.href);

        //configure mockserver
        MockServer.config({
          autoRespond: true,
          autoRespondAfter: uriParameters.get("serverDelay" || 500),
        });

        //simulate

        let path = "../localService";
        mockServer.simulate(path + "/metadata.xml", path + "/mockData");

        mockServer.start();
      },
    };
  }
);
