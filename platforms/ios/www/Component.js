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
            //var oModel = new JSONModel();
//            // Set data to the model
//            oModel.loadData("data/BusinessCardApp.json");
//          // Set Binding mode
            //oModel.setDefaultBindingMode(sap.ui.model.BindingMode.TwoWay);
//          // Set the model to the view
            //this.setModel(oModel);
			// create the views based on the url/hash
			this.getRouter().initialize();
            // Register event listener on device ready
            document.addEventListener("deviceready", this.onDeviceReady, false);
            // Register event listener on resume
            document.addEventListener("resume", this.onResume, false);
            // Subscribe to event
            var oEventBus = sap.ui.getCore().getEventBus();
            oEventBus.subscribe("DataSetToComponent", "RefreshData", this._refresh, this);
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
        },

        _refresh: function(){
            MessageToast.show("Component - refresh");
            this.getModel().refresh();
        }
	});

});
