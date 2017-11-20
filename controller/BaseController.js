sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/ui/core/routing/History",
	"hs/fulda/customer/management/misc/DataManager",
	"sap/ui/model/json/JSONModel",
	'sap/m/MessageBox'
], function(Controller, History, DataManager, JSONModel, MessageBox) {
	"use strict";
	return Controller.extend("hs.fulda.customer.management.controller.BaseController", {
        onInit: function(){
           console.log("Base Controller initialized");


        },
        /**
          * Getter for sap.m.router reference
          * @public
          * @returns {sap.m.Router}
        */
        getRouter: function() {

		},
        /**
		 * Getter for the resource bundle.
		 * @public
		 * @returns {sap.ui.model.resource.ResourceModel} the resourceModel of the component
		 */
		getResourceBundle: function() {
			return this.getOwnerComponent().getModel("i18n").getResourceBundle();
		},

        navBack: function(){

        }
    });
});
