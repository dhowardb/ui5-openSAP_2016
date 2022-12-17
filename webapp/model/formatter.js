sap.ui.define([], function () {
  "use strict";

  return {
    /**
     * Rounds the number unit sValue to 2 digits
     * @public
     * @param {string} sValue the number string to be rounded
     * @returns {string} sValue with 2 digits rounded
     */
    numberUnit: function (sValue) {
      if (!sValue) {
        return "";
      }
      // return parseFloat(sValue).toFixed(2);
      return parseFloat(sValue.replace(/,/g, "")).toFixed(2);
    },

    stocksUnit: function (value) {
      const intValue = parseInt(value.replace(/,/g, ""));
      if (intValue) {
        if (intValue < 3000) {
          return "Low Stocks";
        } else if (intValue >= 3000 && intValue < 7000) {
          return "Moderate Stocks";
        } else {
          return "High Stocks";
        }
      }
    },

    stocksStatus: function (value) {
      const intValue = parseInt(value.replace(/,/g, ""));
      if (intValue) {
        if (intValue < 3000) {
          return "Error";
        } else if (intValue >= 3000 && intValue < 7000) {
          return "Warning";
        } else {
          return "Success";
        }
      }
    },

    discontinued: function (value) {
      switch (value) {
        case "Yes": {
          return "discontinued";
          break;
        }
        default: {
          return "is still on Production";
        }
      }
    },

    // formatUri: function (street, zip, city, country) {
    //   return (
    //     "https://googlemaps.api" +
    //     jQuery.sap.encodeURL(street + "," + zip + "," + city + "," + country)
    //   );
    // },
  };
});
