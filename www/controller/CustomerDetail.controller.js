sap.ui.define([
    "hs/fulda/customer/management/controller/BaseController",
    "jquery.sap.global",
    "sap/ui/model/json/JSONModel",
    "sap/m/Button",
	"sap/m/Dialog",
	"sap/m/Text",
    "sap/m/MessageToast"
], function (BaseController, JQuery, JSONModel, Button, Dialog, Text, MessageToast) {
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
            // Set the initial form to be the display one
            var oPage = this.getView().byId("pageShowCustomerDetail");
            this.oFormFragment = sap.ui.xmlfragment(this.getView().getId(), "hs.fulda.customer.management.fragment.CustomerDetailDisplay");
			oPage.insertContent(this.oFormFragment);
        },

        /**
         * Is called everytime the route gets matched
         * @private
         */
        _onObjectMatched: function(oEvent){
            this.iCampaignId = oEvent.getParameter("arguments").CampaignId;
            this.iCustomerId = oEvent.getParameter("arguments").CustomerId;
            this.sItemBindingPath = "/Campaigns/"+this.iCampaignId+"/Customer/"+this.iCustomerId;
            // Set Binding
            var oObjectHeaderCustomerDetail = this.getView().byId("objHeaderCustomerDetail");
            oObjectHeaderCustomerDetail.bindElement({
                path: this.sItemBindingPath
            });
            var oTextAreaCustomerDetailNotes = this.getView().byId("textAreaCustomerDetailNotes");
            oTextAreaCustomerDetailNotes.bindElement({
                path: this.sItemBindingPath
            });

            var oSmartFormCustomerDetail = this.getView().byId("formDisplayCustomerDetail");
            oSmartFormCustomerDetail.bindElement({
                path: this.sItemBindingPath
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
        editCustomerData: function(oEvent){
            this.oFormFragment.destroy(true);

            // Disable export Button
            this.getView().byId("btnExportCustomer").setVisible(false);
            this.getView().byId("btnEditCustomer").setVisible(false);
            // ENable edit Buttons
            this.getView().byId("btnSaveCustomer").setVisible(true);
            this.getView().byId("btnCancelEditCustomer").setVisible(true);
            // Show edit view
            var oPage = this.getView().byId("pageShowCustomerDetail");
            this.oFormFragment = sap.ui.xmlfragment(this.getView().getId(), "hs.fulda.customer.management.fragment.CustomerDetailChange");
			oPage.removeAllContent();
			oPage.insertContent(this.oFormFragment);
            oPage.setShowNavButton(false);
            var oSmartFormCustomerDetailChange = this.getView().byId("formDisplayCustomerDetailChange");
            oSmartFormCustomerDetailChange.bindElement({
                path: this.sItemBindingPath
            });
        },
        /**
         * Edit Customer Data
         * @public
         */
        cancelEditCustomerData: function(oEvent){
            this.oFormFragment.destroy(true);
            var oSource = oEvent.getSource();

            // Enable export Button
            this.getView().byId("btnExportCustomer").setVisible(true);
            this.getView().byId("btnEditCustomer").setVisible(true);
            // Disable edit Buttons
            this.getView().byId("btnSaveCustomer").setVisible(false);
            this.getView().byId("btnCancelEditCustomer").setVisible(false);
            // Show display view
            var oPage = this.getView().byId("pageShowCustomerDetail");
            this.oFormFragment = sap.ui.xmlfragment(this.getView().getId(), "hs.fulda.customer.management.fragment.CustomerDetailDisplay");
			oPage.removeAllContent();
			oPage.insertContent(this.oFormFragment);
            oPage.setShowNavButton(true);
            // Bind data
            var oTextAreaCustomerDetailNotes = this.getView().byId("textAreaCustomerDetailNotes");
            oTextAreaCustomerDetailNotes.bindElement({
                path: this.sItemBindingPath
            });

            var oSmartFormCustomerDetail = this.getView().byId("formDisplayCustomerDetail");
            oSmartFormCustomerDetail.bindElement({
                path: this.sItemBindingPath
            });
        },
        /**
         * Save Customer Data
         * @public
         */
        saveCustomer: function(oEvent){
            // Save Data persistent
            var JSONData = this.getView().getModel().getJSON();
            this.saveData(JSONData);
            this.getOwnerComponent().getModel().refresh(true);
            // Destroy form
            this.oFormFragment.destroy(true);
            // Enable export Button
            this.getView().byId("btnExportCustomer").setVisible(true);
            this.getView().byId("btnEditCustomer").setVisible(true);
            // Disable edit Buttons
            this.getView().byId("btnSaveCustomer").setVisible(false);
            this.getView().byId("btnCancelEditCustomer").setVisible(false);
            // Show display view
            var oPage = this.getView().byId("pageShowCustomerDetail");
            this.oFormFragment = sap.ui.xmlfragment(this.getView().getId(), "hs.fulda.customer.management.fragment.CustomerDetailDisplay");
			oPage.removeAllContent();
			oPage.insertContent(this.oFormFragment);
            oPage.setShowNavButton(true);
            // Bind data
            var oTextAreaCustomerDetailNotes = this.getView().byId("textAreaCustomerDetailNotes");
            oTextAreaCustomerDetailNotes.bindElement({
                path: this.sItemBindingPath
            });

            var oSmartFormCustomerDetail = this.getView().byId("formDisplayCustomerDetail");
            oSmartFormCustomerDetail.bindElement({
                path: this.sItemBindingPath
            });
        }
	});
});
