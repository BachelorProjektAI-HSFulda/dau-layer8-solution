sap.ui.define([
    "hs/fulda/customer/management/controller/BaseController",
    "jquery.sap.global",
    "sap/m/Button",
	"sap/m/Dialog",
	"sap/m/Text",
    "sap/m/MessageToast",
    "sap/m/MessageBox"
], function (BaseController, JQuery, Button, Dialog, Text) {
    "use strict";

    return BaseController.extend("hs.fulda.customer.management.controller.Campaign", {

        /**
         * Lifecycle Method which is called at the first start of the App
         */
        onInit: function(){
            // Set style class cozy
            this.getView().addStyleClass("cozy");
            document.addEventListener("pause", this.saveData, false);
        },

        saveData: function(){
            console.log(this);
            console.log(this.getView());
        },

        onTest: function(){
            console.log("onTest");
            this.requestFileSystem();
        },

        /**
         * Adds a campaign in the app
         */
        onAddCampaign: function(oEvent){
            if(!navCon){
                var navCon = this.getView().byId("navContainerCampaignList");
            }
			var target = oEvent.getSource().data("target");
			if (target) {
				var animation = "show";
				navCon.to(this.getView().byId(target), animation);
			} else {
				navCon.back();
			}
		},

        onCampaignItemPressed: function(oEvent){
            var oItem = oEvent.getSource();
			var oRouter = this.getRouter();
            var sPath = oItem.getBindingContext().getPath();
            var object = oItem.getModel().getProperty(sPath);
            console.log(object.CampaignId);

			oRouter.navTo("Customer", {
				CampaignId: object.CampaignId
			});
        },

        onSaveCampaign: function(oEvent){
            var iCampaignCount = this.getView().byId("campaignList").getBinding("items").getLength()+1;

            if(!oModel){
                var oModel = this.getView().getModel();
            }

            var oNewCampaignData = {
                    "CampaignId" : iCampaignCount,
                    "CampaignName" : "",
                    "Description" : ""
            };

            if(!oInputCampaignName){
                var oInputCampaignName = this.getView().byId("inputCampaignName");
            }
            var sCampaignName = oInputCampaignName.getValue();

            if(!oInputCampaignDesc){
                var oInputCampaignDesc = this.getView().byId("inputCampaignDesc");
            }
            var sCampaignDesc = oInputCampaignDesc.getValue();

            // Check if the entries are valid
            if(sCampaignName === null ||
               sCampaignName === undefined ||
               sCampaignName === ""){
                this.getView().byId("inputCampaignName").setValueState(sap.ui.core.ValueState.Error);
				this.getView().byId("inputCampaignName").setValueStateText(this.getResourceBundle().getText("campaignNameNotValid"));
            } else {
                this.getView().byId("inputCampaignName").setValueState(sap.ui.core.ValueState.None);
                oNewCampaignData.CampaignName = sCampaignName;
            }
            // Check if the entries are valid
            if(sCampaignDesc === null ||
               sCampaignDesc === undefined ||
               sCampaignDesc === ""){
                this.getView().byId("inputCampaignDesc").setValueState(sap.ui.core.ValueState.Error);
				this.getView().byId("inputCampaignDesc").setValueStateText(this.getResourceBundle().getText("campaignDescNotValid"));
            } else {
                this.getView().byId("inputCampaignDesc").setValueState(sap.ui.core.ValueState.None);
                oNewCampaignData.Description = sCampaignDesc;
            }

            if(!oModel.getProperty("/Campaigns")){
                var bValueSet = oModel.setProperty("/Campaigns");
                if(bValueSet === true){
                    var aCampaigns = [];
                }
            } else {
                var aCampaigns = oModel.getProperty("/Campaigns");
            }

            aCampaigns.push(oNewCampaignData);

            var bResponse = oModel.setProperty("/Campaigns", aCampaigns);
            if(bResponse === true){
                this.onCampaignCreateSuccess(sCampaignName);
            } else {
                console.log("error");
            }
        },

        /**
         * Open Settings
         */
        handleSettingsPressed: function(oEvent) {
            this.getRouter().navTo("Settings");
		},

        onCampaignCreateSuccess: function(sCampaignName){
            var navCon = this.getView().byId("navContainerCampaignList");
//            var sText = this.getResourceBundle().getText("campaignCreateSuccess");
//            var msg = sText.replace("&", sCampaignName);
//			MessageToast.show(msg);

            var animation = "show";
            navCon.to(this.getView().byId("pageShowCampaigns"), animation);
            this.getView().byId("inputCampaignName").setValue("");
            this.getView().byId("inputCampaignDesc").setValue("");
        }
	});
});
