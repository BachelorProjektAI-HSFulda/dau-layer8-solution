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
			// create the views based on the url/hash
			this.getRouter().initialize();
            // Register event listener on device ready
            document.addEventListener("deviceready", this.onDeviceReady, false);
            // Register event listener on resume
            document.addEventListener("resume", this.onResume, false);
		},
        /**
         * Event is called when the app gets opened on iOS
         * The app must exist in the memory on the phone
         */
        onResume: function(){
            MessageToast.show("onResume");
            console.log("onResume");
        },
        /**
         *
         */
        onDeviceReady: function(){
            // Call the method to request the data file on the file system / create a new one
            sap.ui.controller("hs.fulda.customer.management.controller.BaseController").requestFile();
        }
	});

});
