sap.ui.define([], function () {
  return {
    delivery: function (stocks) {
      let deliveryType = "";
      if (stocks > 5) {
        deliveryType = "Mail Deliver";
      }
      if (stocks > 10) {
        deliveryType = "Parcel Deliver";
      }
      if (stocks > 25) {
        deliveryType = "Carrier Deliver";
      }

      return deliveryType;
    },
  };
});
