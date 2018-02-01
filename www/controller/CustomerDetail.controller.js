sap.ui.define([
    "hs/fulda/customer/management/controller/BaseController",
    "jquery.sap.global",
    "sap/m/Button",
	"sap/m/Dialog",
	"sap/m/Text",
    "sap/m/MessageToast"
], function (BaseController, JQuery, Button, Dialog, Text, MessageToast) {
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
            this.iCustomerId = oEvent.getParameter("arguments").CustomerId;
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

            var oSmartFormCustomerDetail = this.getView().byId("formDisplayCustomerDetail");
            oSmartFormCustomerDetail.bindElement({
                path: sItemBindingPath
            });
        },
        /**
         * This method exports the customer data to the file System as a contact
         * @public
         */
        exportCustomer: function(oEvent){
            var aEmails = [];
            var aPhoneNumbers = [];
            var aOrganizations = [];
            //phoneNumbers[0] = new ContactField('work', employee.officePhone, false);
            // Export Data from the view
            var oObjectHeaderCustomerDetail = this.getView().byId("objHeaderCustomerDetail");
            var sCustomerTitle = oObjectHeaderCustomerDetail.getTitle();
            var sCustomerCompany = oObjectHeaderCustomerDetail.getIntro();
            var sCustomerTel = this.getView().byId("customerDetailTelephone").getText();
            var sCustomerEMail = this.getView().byId("customerDetailEMail").getText();
            var sCustomerNotes = this.getView().byId("textAreaCustomerDetailNotes").getValue();
            // Set mobile Number to array
            aPhoneNumbers[0] = new ContactField('mobile', sCustomerTel, true);
            // Set email to array
            aEmails[0] = new ContactField('work', sCustomerEMail, true);
            // Set COmpany to array
            aOrganizations = new ContactOrganization(false, '', sCustomerCompany, '', null);

            // Request Contact Object
            var oNewContact = navigator.contacts.create({
                "displayName": sCustomerTitle,
                //"organizations": aOrganizations,
                "emails": aEmails,
                "phoneNumbers": aPhoneNumbers,
                "notes": sCustomerNotes
            });

            // Save data to the phones file system
            oNewContact.save($.proxy(this.onContactSaveSuccess, this), $.proxy(this.onContactSaveError, this));
        },
        /**
         * Error callback after contact was successfully saved
         * @public
         */
        onContactSaveSuccess: function(oSuccess){
            MessageToast.show(this.getResourceBundle().getText("contactExportSuccesfully"));
        },
        /**
         * Error callback after contact was not succesfully saved
         * @public
         */
        onContactSaveError: function(oError){

        },
        /**
         * Edit Customer Data
         * @public
         */
        editCustomerData: function(){
            var oPage = this.getView().byId("pageShowCustomerDetail");
            var oFormFragment = sap.ui.xmlfragment(this.getView().getId(), "hs.fulda.customer.management.fragment.CustomerDetailChange");
			oPage.removeAllContent();
			oPage.insertContent(oFormFragment);
        }
	});
});
