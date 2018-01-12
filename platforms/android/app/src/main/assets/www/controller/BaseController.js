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
         * Init Google Vision api
         */
        sendDataToGoogleVisionAPI: function(imageData){
            // Init
            var xhr = new XMLHttpRequest();
            var token = "AIzaSyBfMfxZyVWNNNk2T8WO8tn4Ss7_9GDo3eM";
            var n = imageData.search(",");
            imageData = imageData.substring(n+1, imageData.length);
            imageData = imageData.trim();
            var bCompact = !!this.getView().$().closest(".sapUiSizeCompact").length;
            var that = this;

            xhr.addEventListener("readystatechange", function(){
                if (this.readyState === this.DONE) {
                    that.onTestJSONResponse(this.response);
	            }
            });
            // Build request data
            var data = '{"requests": [{"image": {"content": "'+imageData+'"},"features": [{"type": "TEXT_DETECTION"}]}]}';
            // Set URI
            xhr.open("POST", " https://vision.googleapis.com/v1/images:annotate?key=" + token);
            // Adding Request Headers
            xhr.setRequestHeader("Content-Length", data.length);
            xhr.setRequestHeader("Content-Type", "application/json");
            xhr.setRequestHeader("Accept", "application/json");
            xhr.setRequestHeader("Authorization", token);
            // Send data to the google vision api
            xhr.send(data);
        },

        onTestJSONResponse: function(sResponseJSON){
            var bCompact = !!this.getView().$().closest(".sapUiSizeCompact").length;
            var oResponse = new JSONModel();
            //oResponse.loadData("data/response.json", "", false);
            oResponse.setJSON(sResponseJSON);
            var sText = oResponse.getProperty("/responses/0/fullTextAnnotation/text");
             MessageBox.alert(
                sText,
                {
                    styleClass: bCompact ? "sapUiSizeCompact" : ""
                }
            );


            if(sText.includes("@") === true){
                var n = sText.search("@");
                var sNameText = sText.substring(0, n);
                for(var i = n-1; i > 0; i--){
                    if(sNameText.substring(i, i+1) === " " || sNameText.substring(i, i+1) === "\n"){
                        break;
                    }
                }

                // Find Email Provider
                var sEmailProvider = sText.substring(n, sText.length);

                // Find end of email provide
                    var y = sEmailProvider.search("\n");

                // Build email address
                sEmailProvider = sEmailProvider.substring(0, y);

                var sEmailName = sText.substring(i+1, n);
                var sEmail = sEmailName.concat(sEmailProvider);
//                sText = sText.replace(sEmail, "");
                console.log(sText);
            }

            MessageBox.alert(
                sEmail,
                {
                    styleClass: bCompact ? "sapUiSizeCompact" : ""
                }
            );
        },
        requestTelefon: function(sText){
            // Find Telefon
            var aDesList = ["Telefon", "TELEFON", "Tel", ""];
            var aMobile = ["1511", "1512", "1514", "1515", "1516", "1517", "160", "170", "171", "175",
                            "1520", "1522", "1523", "1525", "162", "172", "173", "174",
                            "1570", "1573", "1575", "1577", "1578", "163", "177", "178",
                            "1590", "176", "179"];
            var aLocal = ["02", "03", "04", "05", "06", "07", "08", "09"];


//            if(sText.includes("E-MAIL") === true){
//                var n = sText.search("E-MAIL");
//                sText = sText.substring(n, sText.length);
//                n = sText.search(" ");
//                sText = sText.substring(n+1, sText.length);
//                n = sText.search(" ");
//                sText = sText.substring(0, n);
//                console.log(sText);
//                console.log(n);
//            } else if(sText.includes("E-Mail") === true){
//                var n = sText.search("E-MAIL");
//                console.log(n);
//            } else if(sText.includes("EMail") === true){
//                var n = sText.search("E-MAIL");
//                console.log(n);
//            } else if(sText.includes("EMAIL") === true){
//                var n = sText.search("E-MAIL");
//                console.log(n);
//            }
        },
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
                var sPathFull = "file://"+sPath;
                // Store File Path to local Storage
                this.setImagePath(sPathFull);
//                MessageToast.show(sPathFull);

                // Read File from File System
                this.dataManager.getImageFile($.proxy(this.getImageFileSuccess, this), $.proxy(this.getFileError, this), sPathFull);
            }
        },

        /**
         * Success handler: Get image file success
         * @public
         */
        getImageFileSuccess: function(fileEntry){
            MessageToast.show("getImageFileSuccess");
            fileEntry.file($.proxy(this.readFile, this), $.proxy(this.getFileError, this));
        },

        readFile: function(file){
            var that = this;

            MessageToast.show('got file...',file);
            var reader = new window.FileReader();
            reader.oneerror = function(oError){
                MessageToast.show('FileReader Error: ',oError.target.result);
            };
            reader.onloadend = function(fileObject) {
                that.sendDataToGoogleVisionAPI(fileObject.target._result);
            };
            reader.readAsDataURL(file);
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
