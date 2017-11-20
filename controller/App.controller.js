
sap.ui.define([
    "hs/fulda/customer/management/controller/BaseController",
    "jquery.sap.global",
    "sap/m/Button",
	"sap/m/Dialog",
	"sap/m/Text"
], function (BaseController, JQuery, Button, Dialog, Text) {
    "use strict";

    return BaseController.extend("hs.fulda.customer.management.controller.App", {

        /**
         * Lifecycle Method which is called at the first start of the App
         */
        onInit: function(){
            this.getView().addStyleClass("cozy");
        },
        /**
         * Adds an campaign in the app
         * the campaign has to be created on the database
         */
        onAddCampaign: function(oEvent){

        }
	});
});
