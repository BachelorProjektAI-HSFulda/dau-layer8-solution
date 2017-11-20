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

    return DataManager;

});


