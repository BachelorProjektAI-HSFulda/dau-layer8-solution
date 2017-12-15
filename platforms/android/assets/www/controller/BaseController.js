sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/ui/core/routing/History",
	"hs/fulda/customer/management/misc/DataManager",
	"sap/ui/model/json/JSONModel",
	'sap/m/MessageBox',
    'sap/m/MessageToast'
], function(Controller, History, DataManager, JSONModel, MessageBox, MessageToast) {
	"use strict";
	return Controller.extend("hs.fulda.customer.management.controller.BaseController", {
        dataManager: DataManager,

        requestFile: function(){
            MessageToast.show("on Device Ready - Base Controller");
            //this.requestFileSystem();
        },

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
		 *
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
		 *
		 */
        onRequestFileSystemSuccess: function(fileSystem){
            console.log("onRequestFileSystemSuccess:");

            var mParameters = {
                create: false,
                exclusive: false
            };

            this.dataManager.getFile(fileSystem, $.proxy(this.getFileSuccess, this), $.proxy(this.getFileError, this), mParameters);
        },

        /**
		 *
		 */
        onRequestFileSystemError: function(oEvent){
            MessageToast.show("onRequestFileSystemError");
            console.log(oEvent);
        },

        /**
		 *
		 */
        getFileSuccess: function(fileEntry){
            var sCreateFile = this.getFileCreate();

            if(sCreateFile === "true"){
                console.log("get File Success -- Create File");
                this.dataManager.getFileWriter(fileEntry, $.proxy(this.onGetFileWriterSuccess, this), $.proxy(this.onGetFileWriterError, this), data);
            } else {
                console.log("get File Success -- Read File");
                // Read File
                this.dataManager.readFile(fileEntry, $.proxy(this.onReadFileSuccess, this), $.proxy(this.onReadFileError, this));
            }

        },

        /**
		 *
		 */
        getFileError: function(oEvent){
            if(oEvent.code === 1){
                console.log("get File Error -- request New File");
                this.requestNewFileSystem();
            } else if(oEvent.code === 4){
                MessageToast.show("File not readable");
            } else if(oEvent.code === 5){
                MessageToast.show("File encoding error");
            } else {
                MessageToast.show("Error Code:"+ oEvent.code);
            }
        },

        onGetFileWriterSuccess: function(fileWriter){
            console.log("onGetFileWriterSuccess");
            console.log(fileWriter);

            var data = "{}";

            // File writer success function
            fileWriter.onwriteend = function() {
                console.log("Successful file write...");
            };

            // File Writer error function
            fileWriter.onerror = function (e) {
                console.log("Failed file write: " + e.toString());
            };

            fileWriter.write(data);

        },

        onGetFileWriterError: function(){
            console.log("onCreateFileWriterError");
        },

        /**
		 *
		 */
        onCreateFileSuccess: function(fileEntry) {
            console.log("fileEntry is file?" + fileEntry.isFile.toString());
        },

        /**
		 *
		 */
        onCreateFileError: function(oEvent){
            console.log("onCreateFileError");
            console.log(oEvent);
        },

        /**
		 *
		 */
        onReadFileSuccess: function(sFullPath, sResult) {
            console.log("onReadFileSuccess");
            console.log(sResult);
            console.log(sFullPath);

        },

        /**
		 *
		 */
        onReadFileError: function(oEvent){
            console.log("onReadFileError");
            console.log(oEvent);
        },

        /**
		 *
		 */
        onResolveSuccess: function(fileEntry) {
            console.log(fileEntry);
            console.log(fileEntry.name);
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
