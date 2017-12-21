sap.ui.define([
	"sap/ui/core/UIComponent",
	"sap/ui/model/json/JSONModel",
    "hs/fulda/customer/management/controller/BaseController",
    "sap/m/MessageToast"
], function (UIComponent, JSONModel, BaseController, MessageToast) {
	"use strict";

	return UIComponent.extend("hs.fulda.customer.management.Component", {

		metadata: {
			manifest: "json"
		},

		init: function () {
			// call the init function of the parent
			UIComponent.prototype.init.apply(this, arguments);
			// Initalize the model
            var oModel = new JSONModel();
            // Set data to the model
            oModel.loadData("data/BusinessCardApp.json");
            // Set Binding mode
            oModel.setDefaultBindingMode(sap.ui.model.BindingMode.TwoWay);
            // Set the model to the view
            this.setModel(oModel);
			// create the views based on the url/hash
			this.getRouter().initialize();
            // Register event listener on device ready
            document.addEventListener("deviceready", this.onDeviceReady, false);
		},

        onDeviceReady: function(){
            // Call the method to request the data file on the file system / create a new one
            sap.ui.controller("hs.fulda.customer.management.controller.BaseController").requestFile();
        }
	});

});
