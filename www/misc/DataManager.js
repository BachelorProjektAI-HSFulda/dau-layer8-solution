sap.ui.define([
	"sap/ui/base/Object",
    "hs/fulda/customer/management/misc/DataAccess"
], function(Object, DataAccess) {
	"use strict";

    var DataManager = Object.extend("hs.fulda.customer.management.misc.DataManager");

        /**
         * Create a new campaign entry
         */
        DataManager.setCampaign = function(data){

        };
        /**
         * Read a campaign entry
         */
        DataManager.getCampaign = function(campaignId){

        };
        /**
         * Create a new contact entry
         */
        DataManager.setContact = function(data, campaignId){

        };
        /**
         * Read a contact entry
         */
        DataManager.getContact = function(campaignId, contactId){

        };

        DataManager.requestFileSystem = function(fnSuccess, fnError){
            window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, fnSuccess, fnError);
        };

        DataManager.getFile = function(fileSystem, fnSuccess, fnError, mParameters){
            fileSystem.root.getFile("BusinessCardAppData6.txt", mParameters, fnSuccess, fnError);
        };

        DataManager.createPersistentFile = function(fileEntry, fnSuccess, fnError, data){
            //this.writeFile(fileEntry, data);
        };

        DataManager.getFileWriter = function(fileEntry, fnSuccess, fnError){
            fileEntry.createWriter(fnSuccess, fnError);
        };

        DataManager.writeFile = function(fileEntry, dataObj, fnSuccess, fnError) {
            // Create a FileWriter object for our FileEntry (log.txt).
            fileEntry.createWriter(function (fileWriter) {

                fileWriter.onwriteend = function() {
                    console.log("Successful file write...");
                    //readFile(fileEntry);
                    var fnOnErrorReadFile = function(){
                        console.log("Error read file");
                    };

                    fileEntry.file(function (file) {
                        var reader = new FileReader();
                        reader.onloadend = function() {
                            console.log("Successful file read: " + this.result);
                            //displayFileData(fileEntry.fullPath + ": " + this.result);
                        };
                       reader.readAsText(file);
                    }, fnOnErrorReadFile);
                };

                fileWriter.onerror = function (e) {
                    console.log("Failed file write: " + e.toString());
                };

                // If data object is not passed in,
                // create a new Blob instead.
                if (!dataObj) {
                    //dataObj = "data/BusinessCardApp.json", { type: 'text/plain' });
                }

                fileWriter.write(dataObj);
            });
        };

        DataManager.readFile = function(fileEntry, fnSuccess, fnError) {

//            var fnOnErrorReadFile = function(){
//                console.log("Error read file");
//            };

//            fileEntry.file(function (file) {
//                var reader = new FileReader();
//
//                reader.onloadend = fnSuccess;
//                reader.readAsText(file);
//            }, fnError);

            fileEntry.file(function (file) {
                var reader = new FileReader();

                reader.onloadend = function() {
                    fnSuccess(fileEntry.fullPath, this.result);
                };
                reader.readAsText(file);
            }, fnError);
        };

        return DataManager;

});


