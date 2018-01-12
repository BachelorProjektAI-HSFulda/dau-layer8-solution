sap.ui.define([
    "hs/fulda/customer/management/controller/BaseController",
    "jquery.sap.global",
    "sap/m/Button",
	"sap/m/Dialog",
	"sap/m/Text"
], function (BaseController, JQuery, Button, Dialog, Text) {
    "use strict";

    return BaseController.extend("hs.fulda.customer.management.controller.CustomerDetail", {

        /**
         * Lifecycle Method which is called at the first start of the view
         */
        onInit: function(){
            // Set style class cozy
            this.getView().addStyleClass("cozy");

            var oRouter = this.getRouter();
            oRouter.getRoute("CustomerDetail").attachPatternMatched(this._onObjectMatched, this);

            this._oItemTemplate = this.getView().byId("columnListItemCustomer").clone();

        },

        /**
         * Is called everytime the route gets matched
         * @private
         */
        _onObjectMatched: function(oEvent){
            //this.iCampaignId = oEvent.getParameter("arguments").CampaignId-1;
            this.itemBindingPath = "/Campaigns/"+this.iCampaignId+"/Customer";
        }
	});
});
