
sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "jquery.sap.global",
    "sap/m/Button",
	"sap/m/Dialog",
	"sap/m/Text"
], function (Controller, JQuery, Button, Dialog, Text) {
    "use strict";

    return Controller.extend("hs.fulda.customer.management.controller.App", {

        /*
         * Lifecycle Method which is called at the first start of the App
         */
        init: function(){
            this._oCampaignList = this.getView().byId("campaignList");
            this._oCampaignList.setNoDataText("Please create a campaign");

        },

        /*
         * Adds an campaign in the app
         * the campaign has to be created on the database
         */
        onAddCampaign: function(oEvent){

        }
	});
});
