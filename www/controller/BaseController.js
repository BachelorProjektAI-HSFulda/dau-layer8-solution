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
            this.requestFileSystem();
        },
        /**
		 * Request File System to read/create a file
         * @public
		 */
        requestFileSystem: function(){
            this.setFileCreate("false");
            this.dataManager.requestFileSystem($.proxy(this.onRequestFileSystemSuccess, this), $.proxy(this.onRequestFileSystemError, this));
        },

         requestNewFileSystem: function(){
            this.setFileCreate("true");
            this.dataManager.requestFileSystem($.proxy(this.onRequestNewFileSystemSuccess, this), $.proxy(this.onRequestFileSystemError, this));
        },

        /**
		 * Success handler for method: requestileSystem
         * @public
		 */
        onRequestFileSystemSuccess: function(fileSystem){
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
        onRequestFileSystemError: function(){
            MessageToast.show(this.getResourceBundle().getText("statusFileSystemError"));
        },
        /**
		 * Success Handler for method: requestNewFileSystem
         * @public
		 */
        onRequestNewFileSystemSuccess: function(fileSystem){
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
                // File not readable
                MessageToast.show(this.getResourceBundle().getText("statusReadFileError")+ "Error Code: 4");
            } else if(oEvent.code === 5){
                // File encoding error
                MessageToast.show(this.getResourceBundle().getText("statusReadFileError")+ "Error Code: 5");
            } else {
                MessageToast.show("Error Code:"+ oEvent.code);
            }
        },

        /**
		 *
		 */
        onCreateFileSuccess: function(sFullPath, sResult) {
            this._setModel(sResult);
        },

        /**
		 *
		 */
        onCreateFileError: function(){
            MessageToast.show(this.getResourceBundle().getText("statusCreateFileError"));
        },

        /**
		 * Success handler for read file success
         * @public
		 */
        onReadFileSuccess: function(sFullPath, sResult) {
            this._setModel(sResult);
        },

        /**
		 * Error handler for read file success
         * @public
		 */
        onReadFileError: function(){
            MessageToast.show(this.getResourceBundle().getText("statusReadFileError"));
        },

        /**
         * Save App data globally
         * @public
         */
        saveData: function(JSONData){
            localStorage.JSONData = JSONData;
            this.dataManager.requestFileSystem($.proxy(this.onRequestSaveFileSystemSuccess, this), $.proxy(this.onRequestFileSystemError, this));
        },
        /**
         * Succes handler request file system (save)
         */
        onRequestSaveFileSystemSuccess: function(fileSystem){
            var mParameters = {
                create: false,
                exclusive: false
            };
            // Read File from File System
            this.dataManager.getFile(fileSystem, $.proxy(this.getSaveFileSuccess, this), $.proxy(this.getSaveFileError, this), mParameters);
        },
         /**
		 * Success handler for read file
         * @public
		 */
        getSaveFileSuccess: function(fileEntry){
            var JSONData = localStorage.JSONData;
            // Create and write new File
            this.dataManager.writeFile(fileEntry, $.proxy(this.onWriteFileSuccess, this), $.proxy(this.onWriteFileError, this), $.proxy(this.onReadFileError, this), JSONData);
        },

        getSaveFileError: function(){
            MessageToast.show(this.getResourceBundle().getText("statusWriteFileError"));
        },
        /**
		 * Success handler write file
         * @public
		 */
        onWriteFileSuccess: function(fileEntry){
            localStorage.removeItem("JSONData");
            MessageToast.show(this.getResourceBundle().getText("statusDataSaved"));
        },
        /**
		 * error handler write file
         * @public
		 */
        onWriteFileError: function(){
            MessageToast.show(this.getResourceBundle().getText("statusWriteFileError"));
        },
        /**
         * Method to parse the retrieved json data and
         * publishes the event to bind the data
         * Hint: Do not set the model here to the component, it is to early
         *       so that the data gets displayed on the view
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
            var oHistory = History.getInstance();
			var sPreviousHash = oHistory.getPreviousHash();
            console.log(oHistory);
			if (sPreviousHash !== undefined) {
				window.history.go(-1);
			} else {
				var oRouter = this.getRouter();
				oRouter.navTo("Login");
			}
        },

        /**
         * success capture Image
         * @public
         */
        captureSuccess: function(mediaFiles) {
            var i, sPath, len;
            for (i = 0, len = mediaFiles.length; i < len; i += 1) {
                sPath = mediaFiles[i].fullPath;
                // Store File Path to local Storage
                this.setImagePath(sPath);
                this.dataManager.requestFileSystem($.proxy(this.onRequestFileSystemImageSuccess, this), $.proxy(this.onRequestFileSystemError, this));
            }
        },

        /* Success handler for method: requestileSystem
         * @public
		 */
        onRequestFileSystemImageSuccess: function(fileSystem){

            var mParameters = {
                create: false,
                exclusive: false
            };
            var sPath = this.getImagePath();
            navigator.camera.getPicture(
                  function (fileURI){
                     MessageToast.show(fileURI);
                     /* remove the comment below to use with
                      * the rest of the code on this page
                      */
                     //convertPath(fileURI);
                  },
                  function (err){
                     // fail
                     MessageToast.show('fail',err);
                  },
                  {
                     allowEdit: true,
                     correctOrientation: true,
                     destinationType: Camera.DestinationType.FILE_URI,
                     sourceType: Camera.PictureSourceType.PHOTOLIBRARY,
                     targetHeight: window.innerHeight,
                     targetWidth: window.innerWidth
                  }
           );


            // Read File from File System
//            this.dataManager.getImageFile(fileSystem,
//                                          $.proxy(this.getImageFileSuccess, this),
//                                          $.proxy(this.getFileError, this),
//                                          mParameters,
//                                          sPath);
        },

        /**
         * Success handler: Get image file success
         * @public
         */
        getImageFileSuccess: function(fileEntry){
            MessageToast.show("getImageFileSuccess");
        },

        /**
         * error capture Image
         * @public
         */
        captureError: function(error) {
            // implement suitable error handling here
            navigator.notification.alert('Error code: ' + error.code, null, 'Capture Error');
        },

        /**
         * Start capture Image
         * @public
         */
        startCapture: function(){
            navigator.device.capture.captureImage($.proxy(this.captureSuccess, this), $.proxy(this.captureError, this), {limit:1});
        },
        /**
         * Lifecycle method to free objects on close of the app
         * @private
         */
        onExit: function(){
        },
        /**
         * Global Nav Back Handler
		 * @public
		 */
        handleSettingsPressed: function(){

        },
        /**
		 * Setter method for boolean create
		 * @private
		 */
        setFileCreate: function(bCreateFile){
            localStorage.bCreateFile = bCreateFile;
        },
        /**
		 * Getter method which returns the boolean create
		 * @private
		 */
        getFileCreate: function(){
            return localStorage.bCreateFile;
        },

         /**
		 * Setter method for boolean create
		 * @private
		 */
        setImagePath: function(sPath){
            localStorage.imagePath = sPath;
        },
        /**
		 * Getter method which returns the boolean create
		 * @private
		 */
        getImagePath: function(){
            return localStorage.imagePath;
        }
    });
});
