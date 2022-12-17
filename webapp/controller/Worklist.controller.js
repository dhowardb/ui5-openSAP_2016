sap.ui.define(
  [
    "./BaseController",
    "sap/ui/model/json/JSONModel",
    "../model/formatter",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator",
    "sap/ui/model/FilterType",
  ],
  function (
    BaseController,
    JSONModel,
    formatter,
    Filter,
    FilterOperator,
    FilterType
  ) {
    "use strict";

    return BaseController.extend("week3.controller.Worklist", {
      formatter: formatter,

      _filterObject: {
        Cheap: [new Filter("UnitPrice", "LT", 100)],
        Moderate: [new Filter("UnitPrice", "BT", 100, 750)],
        Expensive: [new Filter("UnitPrice", "GT", 750)],
      },

      /* =========================================================== */
      /* lifecycle methods                                           */
      /* =========================================================== */

      /**
       * Called when the worklist controller is instantiated.
       * @public
       */
      onInit: function () {
        var oViewModel;

        // keeps the search state
        this._aTableSearchState = [];

        // Model used to manipulate control states
        oViewModel = new JSONModel({
          worklistTableTitle:
            this.getResourceBundle().getText("worklistTableTitle"),
          shareSendEmailSubject: this.getResourceBundle().getText(
            "shareSendEmailWorklistSubject"
          ),
          shareSendEmailMessage: this.getResourceBundle().getText(
            "shareSendEmailWorklistMessage",
            [location.href]
          ),
          tableNoDataText: this.getResourceBundle().getText("tableNoDataText"),
          Cheap: "",
          Moderate: "",
          Expensive: "",
        });
        this.setModel(oViewModel, "worklistView");
      },

      /* =========================================================== */
      /* event handlers                                              */
      /* =========================================================== */

      /**
       * Triggered by the table's 'updateFinished' event: after new table
       * data is available, this handler method updates the table counter.
       * This should only happen if the update was successful, which is
       * why this handler is attached to 'updateFinished' and not to the
       * table's list binding's 'dataReceived' method.
       * @param {sap.ui.base.Event} oEvent the update finished event
       * @public
       */
      onUpdateFinished: function (oEvent) {
        // update the worklist's object counter after the table update
        var sTitle,
          oTable = oEvent.getSource(),
          iTotalItems = oEvent.getParameter("total");

        // const model = this.getModel();
        // const viewModel = this.getModel("worklistView");

        // only update the counter if the length is final and
        // the table is not empty
        if (iTotalItems && oTable.getBinding("items").isLengthFinal()) {
          sTitle = this.getResourceBundle().getText("worklistTableTitleCount", [
            iTotalItems,
          ]);

          // jQuery.each(this._filterObject, function (key, filter) {
          //   // const viewModel = this.getMode("worklistView");
          //   this.getModel().read("/Products/$count", {
          //     filters: filter,
          //     Success: function (oData) {
          //       const path = "/" + key;
          //       viewModel.setProperty(path, oData);
          //     },
          //   });
          // });
        } else {
          sTitle = this.getResourceBundle().getText("worklistTableTitle");
        }
        this.getModel("worklistView").setProperty(
          "/worklistTableTitle",
          sTitle
        );
      },

      /**
       * Event handler when a table item gets pressed
       * @param {sap.ui.base.Event} oEvent the table selectionChange event
       * @public
       */
      onPress: function (oEvent) {
        // The source is the list item that got pressed
        this._showObject(oEvent.getSource());
      },

      /**
       * Event handler for navigating back.
       * Navigate back in the browser history
       * @public
       */
      onNavBack: function () {
        // eslint-disable-next-line sap-no-history-manipulation
        history.go(-1);
      },

      onSearch: function (oEvent) {
        if (oEvent.getParameters().refreshButtonPressed) {
          // Search field's 'refresh' button has been pressed.
          // This is visible if you select any main list item.
          // In this case no new search is triggered, we only
          // refresh the list binding.
          this.onRefresh();
        } else {
          var aTableSearchState = [];
          var sQuery = oEvent.getParameter("query").toString();

          //   let view = this.getView().byId("table");
          //   let binding = view.getBinding("items");
          //   //   let sValue = this.getView().byId("searchField").getValue();

          //   aTableSearchState.push(
          //     new Filter("ProductID", FilterOperator.Contains, sQuery)
          //   );

          //   binding.filter(aTableSearchState, FilterType.Application);

          var oView = this.getView(),
            sValue = oView.byId("searchField").getValue(),
            oFilter = new Filter(
              "ProductName",
              FilterOperator.Contains,
              sValue
            );

          oView
            .byId("table")
            .getBinding("items")
            .filter(oFilter, FilterType.Application);

          if (sQuery && sQuery.length > 0) {
            aTableSearchState = [
              new Filter("ProductName", FilterOperator.Contains, sQuery),
            ];
          }
          this._applySearch(aTableSearchState);
        }
      },

      /**
       * Event handler for refresh event. Keeps filter, sort
       * and group settings and refreshes the list binding.
       * @public
       */
      onRefresh: function () {
        var oTable = this.byId("table");
        oTable.getBinding("items").refresh();
      },

      onShowDetailPopOver: function (event) {
        // const popOver = this.byId("popOver");
        const popOver = this._getPopOver();
        popOver.bindElement(event.getSource().getBindingContext().getPath());
        const opener = event.getParameter("domRef");
        popOver.openBy(opener);
      },

      _getPopOver: function () {
        // let popOver;
        // if (!popOver) {
        //   popOver = sap.ui.xmlfragment("week3.fragments.DetailPopOver", this);
        //   this.getView().addDependent(popOver);
        // }
        // return popOver;

        //we use this so every instantiation it triggers new
        //adding this will change the method to a property type
        if (!this.popOver) {
          this.popOver = sap.ui.xmlfragment(
            "week3.fragments.DetailPopOver",
            this
          );
          this.getView().addDependent(this.popOver);
        }
        return this.popOver;
      },

      onShowStatusPopOver: function (event) {
        const popOver = this.byId("statusPopOver");

        popOver.bindElement(event.getSource().getBindingContext().getPath());
        const opener = event.getParameter("domRef");
        popOver.openBy(opener);
      },

      onFilterSelectHandler: function (event) {
        const key = event.getParameter("key");
        const filteredSelect = this._filterObject[key];
        const binding = this.byId("table").getBinding("items");

        binding.filter(filteredSelect);
      },

      /* =========================================================== */
      /* internal methods                                            */
      /* =========================================================== */

      /**
       * Shows the selected item on the object page
       * @param {sap.m.ObjectListItem} oItem selected Item
       * @private
       */
      _showObject: function (oItem) {
        this.getRouter().navTo("object", {
          objectId: oItem
            .getBindingContext()
            .getPath()
            .substring("/Products".length),
        });
      },

      /**
       * Internal helper method to apply both filter and search state together on the list binding
       * @param {sap.ui.model.Filter[]} aTableSearchState An array of filters for the search
       * @private
       */
      _applySearch: function (aTableSearchState) {
        var oTable = this.byId("table"),
          oViewModel = this.getModel("Products");
        oTable.getBinding("items").filter(aTableSearchState, "Application");
        // changes the noDataText of the list in case there are no filter results
        if (aTableSearchState.length !== 0) {
          oViewModel.setProperty(
            "/tableNoDataText",
            this.getResourceBundle().getText("worklistNoDataWithSearchText")
          );
        }
      },
    });
  }
);
