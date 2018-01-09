sap.ui.define([
    "hs/fulda/customer/management/controller/BaseController",
    "jquery.sap.global",
    "sap/m/Button",
	"sap/m/Dialog",
	"sap/m/Text"
], function (BaseController, JQuery, Button, Dialog, Text) {
    "use strict";

    return BaseController.extend("hs.fulda.customer.management.controller.CustomerDetail", {

        /**
         * Lifecycle Method which is called at the first start of the view
         */
        onInit: function(){
            // Set style class cozy
            this.getView().addStyleClass("cozy");

            var oRouter = this.getRouter();
            oRouter.getRoute("CustomerDetail").attachPatternMatched(this._onObjectMatched, this);

        },

        /**
         * Is called everytime the route gets matched
         * @private
         */
        _onObjectMatched: function(oEvent){
            this.iCampaignId = oEvent.getParameter("arguments").CampaignId;
            this.iCustomerId = oEvent.getParameter("arguments").CustomerId-1;
            var sItemBindingPath = "/Campaigns/"+this.iCampaignId+"/Customer/"+this.iCustomerId;
            console.log(sItemBindingPath);
            // Set Binding
            var oObjectHeaderCustomerDetail = this.getView().byId("objHeaderCustomerDetail");
            oObjectHeaderCustomerDetail.bindElement({
                path: sItemBindingPath
            });
            var oTextAreaCustomerDetailNotes = this.getView().byId("textAreaCustomerDetailNotes");
            oTextAreaCustomerDetailNotes.bindElement({
                path: sItemBindingPath
            });
            console.log("Test");
        },
        /**
         * This method exports the customer data to the file System as a contact
         * @public
         */
        exportCustomer: function(oEvent){
            // Export Data from the view
            var oObjectHeaderCustomerDetail = this.getView().byId("objHeaderCustomerDetail");
            var sCustomerTitle = oObjectHeaderCustomerDetail.getTitle();
            var sCustomerCompany = oObjectHeaderCustomerDetail.getIntro();
            var sCustomerTel = this.getView().byId("customerDetailTelephone");
            var sCustomerEMail = this.getView().byId("customerDetailEMail");
            var sCustomerNotes = this.getView().byId("textAreaCustomerDetailNotes");
            // Request Contact Object
            var oNewContact = navigator.contacts.create({"displayName": sCustomerTitle });

            if(sCustomerTel !== "" || sCustomerTel !== undefined){
                oNewContact.phoneNumbers = sCustomerTel;
            }

            if(sCustomerCompany !== "" || sCustomerCompany !== undefined){
                oNewContact.organizations = sCustomerCompany;
            }

            if(sCustomerEMail !== "" || sCustomerEMail !== undefined){
                oNewContact.emails = sCustomerEMail;
            }

            if(sCustomerNotes !== "" || sCustomerNotes !== undefined){
                oNewContact.note = sCustomerNotes;
            }

            console.log(oNewContact);
            // Save data to the phones file system
            //oNewContact.save($.proxy(this.onContactSaveSuccess, this), $.proxy(this.onContactSaveError, this));
        },
        /**
         * Error callback after contact was successfully saved
         * @public
         */
        onContactSaveSuccess: function(oSuccess){
            console.log("onContactSaveSuccess");
            console.log(oSuccess);
        },
        /**
         * Error callback after contact was not succesfully saved
         * @public
         */
        onContactSaveError: function(oError){
            console.log("onContactSaveError");
            console.log(oError);
        },
        /**
         * Edit Customer Data
         * @public
         */
        editCustomerData: function(){

        }
	});
});
