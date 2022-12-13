sap.ui.define(
  [
    "sap/ui/core/mvc/Controller",
    "sap/m/MessageToast",
    "opensap/myapp/model/formatter",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator",
  ],
  function (Controller, MessageToast, formatter, Filter, FilterOperator) {
    Controller.extend("opensap.myapp.controller.App", {
      formatter: formatter,

      onShowHelloHandler: function () {
        let oBundle = this.getView().getModel("i18n").getResourceBundle();
        let sRecipient = this.getView()
          .getModel("helloPanel")
          .getProperty("/recipient/name");
        let message = oBundle.getText("helloMsg", [sRecipient]);
        MessageToast.show(message);
        console.log("test");
      },

      onFilterProducts: function (event) {
        let filteredProducts = [];
        query = event.getParameter("query");
        list = this.getView().byId("invoiceList");
        binding = list.getBinding("items");

        console.log(list);
        console.log(binding.oList);

        if (query) {
          filteredProducts.push(
            new Filter("ProductName", FilterOperator.Contains, query)
          );

          let filteredNewProducts = [];
          for (const product of binding.oList) {
            if (product.ProductName.includes(query)) {
              filteredNewProducts.push(product.ProductName);
            }
          }
          console.log(filteredNewProducts);
          // const testArray = binding.oList.filter((productName) =>
          //   productName.includes(query)
          // );

          // console.log(testArray);
          //need to be an instance of Filter
          binding.filter(filteredProducts);
          // binding.filter(filteredNewProducts); //via JS
          // binding.oList = filteredNewProducts;
        } else {
          binding.filter(binding.oList);
        }
      },

      onItemSelected: function (event) {
        const selectedItem = event.getParameter("listItem");
        const context = selectedItem.getBindingContext();
        const path = context.getPath();

        const panel = this.byId("productDetailsPanel");
        panel.bindElement({ path: path });
        panel.setVisible(true);
      },
    });
  }
);
