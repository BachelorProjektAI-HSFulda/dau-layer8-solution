sap.ui.define([
    "hs/fulda/customer/management/controller/BaseController",
    "jquery.sap.global",
    "sap/m/Button",
	"sap/m/Dialog",
    "sap/m/Input",
	"sap/m/Text",
    "sap/ui/model/json/JSONModel"
], function (BaseController, JQuery, Button, Dialog, Input, Text, JSONModel) {
    "use strict";

    return BaseController.extend("hs.fulda.customer.management.controller.Customer", {

        /**
         * Lifecycle Method which is called at the first start of the view
         */
        onInit: function(){
            // Set style class cozy
            this.getView().addStyleClass("cozy");

            var oRouter = this.getRouter();
            oRouter.getRoute("Customer").attachPatternMatched(this._onObjectMatched, this);

            this._oItemTemplate = this.getView().byId("columnListItemCustomer").clone();
        },

        /**
         * Is called everytime the route gets matched
         * @private
         */
        _onObjectMatched: function(oEvent){
            this.iCampaignId = oEvent.getParameter("arguments").CampaignId-1;
            this.itemBindingPath = "/Campaigns/"+ this.iCampaignId +"/Customer";
            // Bind Campaign Name
            this.getView().byId("customerTitle").bindElement("/Campaigns/"+this.iCampaignId);
//            // Read actual campaign object
//            var oCampaign = this.getView().getModel().getProperty("/Campaigns/"+this.iCampaignId);
//            // Get the title from the object
//            var sTitle = oCampaign.CampaignName;
//            // Set the header title
//            this.getView().byId("customerTitle").setText(sTitle);
            // Bind Customer List
            this.getView().byId("customerList").bindAggregation("items", {
                path: this.itemBindingPath,
                template: this._oItemTemplate
            });
        },

        /**
         *
         */
        onCustomerItemPressed: function(oEvent){
            var oItem = oEvent.getSource();
			var oRouter = this.getRouter();
            var sPath = oItem.getBindingContext().getPath();
            var object = oItem.getModel().getProperty(sPath);
            //console.log(object.CampaignId);

			oRouter.navTo("CustomerDetail", {
                CampaignId: this.iCampaignId,
                CustomerId: object.CustomerId
            });
        },

        /**
         *  Edit Campaign
         */
        onEdit: function(oEvent){
            this.editDialog = this.getView().byId("");
            // Read actual campaign object
            var oCampaign = this.getView().getModel().getProperty("/Campaigns/"+this.iCampaignId);
            console.log(oCampaign);
            var oCampaignData = new JSONModel(oCampaign);
            // Set binding mode
            oCampaignData.setDefaultBindingMode(sap.ui.model.BindingMode.TwoWay);

            if (!this.editDialog) {
				this.editDialog = sap.ui.xmlfragment("hs.fulda.customer.management.fragment.EditCampaign", this);

				//to get access to the global model
				this.getView().addDependent(this.editDialog);
			}
            this.editDialog.setModel(oCampaignData);
            this.editDialog.bindElement("/");
            // toggle compact style
			jQuery.sap.syncStyleClass("sapUiSizeCompact", this.getView(), this.editDialog);
			this.editDialog.open();
        },

        onSaveCampaign: function(sCampaignName){
            var navCon = this.getView().byId("navContainerCampaignList");
            // Save Data persistent
            var JSONData = this.getView().getModel().getJSON();
            this.saveData(JSONData);
            // Nav back to list page
            this.editDialog.close();
            this.getOwnerComponent().getModel().refresh(true);
        },

         /**
         *
         */
        onCloseDialog: function(oEvent){
            console.log(oEvent);

        },

        onDialogOk: function(oEvent){

        },

        onCapturePhoto: function(oEvent){
            if(!navCon){
                var navCon = this.getView().byId("navContainerCustomerList");
            }
            var target = oEvent.getSource().data("target");

            if(!oPage){
                var oPage = this.getView().byId(target);
            }

            // Photo Area
            var myPhotoArea = '<div heigth="100%" width="100%" id="videoArea"></div>';
            var myhtml = new sap.ui.core.HTML();
            myhtml.setContent(myPhotoArea);
            oPage.addContent(myhtml);

			if (target) {
				var animation = "show";
				navCon.to(this.getView().byId(target), animation);
			} else {
				navCon.back();
			}

            var oCamera = navigator.camera;
            oCamera.getPicture(this.onCaptureSuccess, this.onCaptureError, { quality: 10, destinationType: oCamera.DestinationType.DATA_URL });
        },

        onCaptureSuccess: function(){
            var i, path, len;
            for (i = 0, len = mediaFiles.length; i < len; i += 1) {
                path = mediaFiles[i].fullPath;
                console.log(path);
                // do something interesting with the file
            }
        },

        onCaptureError: function(e){
            console.log("capture error: "+JSON.stringify(e));
        },

        /**
         *
         */
        onAddCustomerManual: function(oEvent){
            this.getView().byId("statusErrorCreateCustomer").setVisible(false);
            this.getView().byId("statusInformationCreateCustomer").setVisible(false);

           if(!navCon){
                var navCon = this.getView().byId("navContainerCustomerList");
            }
			var target = oEvent.getSource().data("target");
			if (target) {
				var animation = "show";
				navCon.to(this.getView().byId(target), animation);
			} else {
				navCon.back();
			}
        },

        onSaveCustomer: function(oEvent){
            var iCustomerId;
            var binding = this.getView().byId("customerList").getBinding("items");

            if(binding === undefined){
                iCustomerId = 1;
            } else {
                iCustomerId = this.getView().byId("customerList").getBinding("items").getLength()+1;
            }

            if(!oModel){
                var oModel = this.getView().getModel();
            }

            var oNewCustomerData = {
                "CustomerId": iCustomerId,
                "CustomerName" : "",
                "Company" : ""
            };

            if(!oInputCustomerName){
                var oInputCustomerName = this.getView().byId("inputCustomerName");
            }
            var sCustomerName = oInputCustomerName.getValue();

            if(!oInputCustomerCompany){
                var oInputCustomerCompany = this.getView().byId("inputCustomerCompany");
            }
            var sCustomerCompany = oInputCustomerCompany.getValue();

            if(sCustomerCompany === null || sCustomerCompany === undefined || sCustomerCompany === ""  ||
                sCustomerName === null || sCustomerName === undefined || sCustomerName === ""){
                this.getView().byId("statusInformationCreateCustomer").setVisible(true);
            } else {
                // Set data
                oNewCustomerData.CustomerName = sCustomerName;
                oNewCustomerData.Company = sCustomerCompany;

                if(!oModel.getProperty("/Campaigns/"+ this.iCampaignId +"/Customer")){
                    var bValueSet = oModel.setProperty("/Campaigns/"+ this.iCampaignId +"/Customer");

                    if(bValueSet === true){
                        var aCustomer = [];
                    }
                } else {
                    var aCustomer = oModel.getProperty("/Campaigns/"+ this.iCampaignId +"/Customer");
                }
                // Push data to array
                aCustomer.push(oNewCustomerData);
                // Check status
                var bResponse = oModel.setProperty("/Campaigns/"+ this.iCampaignId +"/Customer", aCustomer);
                // Error handling
                if(bResponse === true){
                    this.onCustomerCreateSuccess(sCustomerName);
                } else {
                    this.getView().byId("statusErrorCreateCustomer").setVisible(true);
                }
             }
        },

        onCustomerCreateSuccess: function(sCustomerName){
            var navCon = this.getView().byId("navContainerCustomerList");
            // Save Data persistent
            var JSONData = this.getView().getModel().getJSON();
            this.saveData(JSONData);

            var animation = "show";
            navCon.to(this.getView().byId("pageShowCustomer"), animation);
            this.getView().byId("inputCustomerName").setValue("");
            this.getView().byId("inputCustomerCompany").setValue("");
        },

        onCancelCustomer: function(oEvent){
            // Clear inout fields
            this.getView().byId("inputCustomerName").setValue("");
            this.getView().byId("inputCustomerCompany").setValue("");
            // Nav Back
            if(!navCon){
                var navCon = this.getView().byId("navContainerCustomerList");
            }
			var target = oEvent.getSource().data("target");
			if (target) {
				var animation = "show";
				navCon.to(this.getView().byId(target), animation);
			} else {
				navCon.back();
			}
        }
	});
});
