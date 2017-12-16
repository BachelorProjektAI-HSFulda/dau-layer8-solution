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
            // BusinessCardAppData6
            fileSystem.root.getFile("mce.txt", mParameters, fnSuccess, fnError);
        };

//        DataManager.createPersistentFile = function(fileEntry, fnSuccess, fnError, data){
//            //this.writeFile(fileEntry, data);
//        };

        DataManager.writeFile = function(fileEntry, fnSuccess, fnError, fnErrorReadFile, dataObj) {

            fileEntry.createWriter(function (fileWriter) {

                fileWriter.onwriteend = function(fileEntry) {
                    if(!dataObj){
                        this.readFile(fileEntry, fnSuccess, fnErrorReadFile);
                    } else {
                        fnSuccess(fileEntry);
                    }
                };

                fileWriter.onerror = function (e) {
                    fnError();
                };

                // If data object is not passed in
                if (!dataObj) {
                    dataObj = '{ "Campaigns" : [{"CampaignId": "1","CampaignName": "CeBit 2017"}]}';
                }
                console.log("Data Manager");
                console.log(dataObj);
                fileWriter.write(dataObj);
            });
        };

        DataManager.readFile = function(fileEntry, fnSuccess, fnError) {

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


