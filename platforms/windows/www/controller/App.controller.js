
sap.ui.define([
    "hs/fulda/customer/management/controller/BaseController",
    "jquery.sap.global"
], function (BaseController, JQuery) {
    "use strict";

    return BaseController.extend("hs.fulda.customer.management.controller.App", {
        /**
         * Lifecycle Method which is called at the first start of the App
         */
        onInit: function(){
            // Set style class cozy
            this.getView().addStyleClass("compact");
            // Set file create to false to check if a file exist
            this.setFileCreate(false);
        },

        saveData: function(){
            console.log(this.getOwnerComponent());
            //console.log(this.getOwnerComponent().getModel());
        }
	});
});
