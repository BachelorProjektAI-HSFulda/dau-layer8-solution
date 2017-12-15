sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/ui/core/routing/History",
	"hs/fulda/customer/management/misc/DataManager",
	"sap/ui/model/json/JSONModel",
	"sap/m/MessageBox",
    "sap/m/MessageToast"
], function(Controller, History, DataManager, JSONModel, MessageBox, MessageToast) {
	"use strict";
	return Controller.extend("hs.fulda.customer.management.controller.BaseController", {
        dataManager: DataManager,
        /**
         * Is called after the event "onDeviceReady" is called from cordova
         * Only in this case the cordova container is ready
         */
        requestFile: function(){
            //MessageToast.show("on Device Ready - Base Controller");
            this.requestFileSystem();
        },
        /**
		 * Request File System to read/create a file
         * @public
		 */
        requestFileSystem: function(){
            console.log("requestFileSystem");
            this.setFileCreate("false");
            this.dataManager.requestFileSystem($.proxy(this.onRequestFileSystemSuccess, this), $.proxy(this.onRequestFileSystemError, this));
        },

         requestNewFileSystem: function(){
            console.log("requestNewFileSystem");
            this.setFileCreate("true");
            this.dataManager.requestFileSystem($.proxy(this.onRequestNewFileSystemSuccess, this), $.proxy(this.onRequestFileSystemError, this));
        },

        /**
		 * Success handler for method: requestileSystem
         * @public
		 */
        onRequestFileSystemSuccess: function(fileSystem){
            console.log("onRequestFileSystemSuccess:");
            var mParameters = {
                create: false,
                exclusive: false
            };
            // Read File from File System
            this.dataManager.getFile(fileSystem, $.proxy(this.getFileSuccess, this), $.proxy(this.getFileError, this), mParameters);
        },

        /**
		 * Error handler for method: requestFileSystem
         * @public
		 */
        onRequestFileSystemError: function(oEvent){
            MessageToast.show("onRequestFileSystemError");
            console.log(oEvent);
        },
        /**
		 * Success Handler for method: requestNewFileSystem
         * @public
		 */
        onRequestNewFileSystemSuccess: function(fileSystem){
            console.log("onRequestNewFileSystemSuccess:");

            var mParameters = {
                create: true,
                exclusive: false
            };
            this.dataManager.getFile(fileSystem, $.proxy(this.getFileSuccess, this), $.proxy(this.getFileError, this), mParameters);
        },
       /**
		 * Success handler for read file success
         * @public
		 */
        getFileSuccess: function(fileEntry){
            var sCreateFile = this.getFileCreate();

            if(sCreateFile === "true"){
                // Create and write new File
                this.dataManager.writeFile(fileEntry, $.proxy(this.onCreateFileSuccess, this), $.proxy(this.onCreateFileError, this), $.proxy(this.onReadFileError, this));
            } else {
                // Read File
                this.dataManager.readFile(fileEntry, $.proxy(this.onReadFileSuccess, this), $.proxy(this.onReadFileError, this));
            }
        },
        /**
		 * Error handler that handles file errors
         * In case of event 1 the file was not found
         * on the file system and it is called a method to create a new one
         * @public
		 */
        getFileError: function(oEvent){
            if(oEvent.code === 1){
                this.requestNewFileSystem();
            } else if(oEvent.code === 4){
                MessageToast.show("File not readable");
            } else if(oEvent.code === 5){
                MessageToast.show("File encoding error");
            } else {
                MessageToast.show("Error Code:"+ oEvent.code);
            }
        },

        /**
		 *
		 */
        onCreateFileSuccess: function(sFullPath, sResult) {
            console.log("onCreateFileSuccess");
            console.log(sResult);
            console.log(sFullPath);
            this._setModel(sResult);
        },

        /**
		 *
		 */
        onCreateFileError: function(){
            console.log("onCreateFileError");
        },

        /**
		 * Success handler for read file success
         * @public
		 */
        onReadFileSuccess: function(sFullPath, sResult) {
            console.log("onReadFileSuccess");
            console.log(sResult);
            console.log(sFullPath);
            this._setModel(sResult);
        },

        /**
		 * Error handler for read file success
         * @public
		 */
        onReadFileError: function(){
            console.log("onReadFileError");
        },
        /**
         * Method to parse the retrieved json data and
         * publishes the event to bind the data
         * @private
         */
        _setModel: function(oData){
            // Parse retrieved JSON
            var json = JSON.parse(oData);
            // Publish event and pass json data to the views to set the model on the component
            // Do not set the model here to the component, it is to early so that the data
            // gets displayed on the view
            var oEventBus = sap.ui.getCore().getEventBus();
            oEventBus.publish("DataSetToModel", "DataReceived", json);
        },

        /**
          * Getter for sap.m.router reference
          * @public
          * @returns {sap.m.Router}
        */
        getRouter: function() {
            return sap.ui.core.UIComponent.getRouterFor(this);
		},

        /**
		 * Getter for the resource bundle.
		 * @public
		 * @returns {sap.ui.model.resource.ResourceModel} the resourceModel of the component
		 */
		getResourceBundle: function() {
			return this.getOwnerComponent().getModel("i18n").getResourceBundle();
		},

        /**
         * Global Nav Back Handler
		 * @public
		 */
        onNavBack: function(){
            window.history.back();
        },

        onExit: function(oEvent){
            console.log("onExit");
            console.log(oEvent);
        },
        /**
         * Global Nav Back Handler
		 * @public
		 */
        handleSettingsPressed: function(){

        },
        /**
		 * Setter method for boolean create
		 * @public
		 *
		 */
        setFileCreate: function(bCreateFile){
            localStorage.bCreateFile = bCreateFile;
        },
        /**
		 * Getter method which returns the boolean create
		 * @public
		 *
		 */
        getFileCreate: function(){
            return localStorage.bCreateFile;
        }
    });
});
