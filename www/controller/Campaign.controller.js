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
            this.getView().byId("statusErrorCreateCampaign").setVisible(false);
            this.getView().byId("statusInformationCreateCampaign").setVisible(false);

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

			oRouter.navTo("Customer", {
				CampaignId: object.CampaignId
			});
        },

        onSaveCampaign: function(oEvent){
            var iCampaignId = this.getView().byId("campaignList").getBinding("items").getLength()+1;

            if(!oModel){
                var oModel = this.getView().getModel();
            }

            var oNewCampaignData = {
                    "CampaignId" : iCampaignId,
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

            if(sCampaignName === null || sCampaignName === undefined || sCampaignName === ""  ||
                sCampaignDesc === null || sCampaignDesc === undefined || sCampaignDesc === ""){
                this.getView().byId("statusInformationCreateCampaign").setVisible(true);
            } else {
                // Set data
                oNewCampaignData.CampaignName = sCampaignName;
                oNewCampaignData.Description = sCampaignDesc;

                if(!oModel.getProperty("/Campaigns")){
                    console.log("else -- set Prop");
                    var bValueSet = oModel.setProperty("/Campaigns");

                    if(bValueSet === true){
                        var aCampaigns = [];
                    }
                } else {
                    console.log("else -- get Prop");
                    var aCampaigns = oModel.getProperty("/Campaigns");
                }
                // Push data to array
                aCampaigns.push(oNewCampaignData);
                // Check status
                var bResponse = oModel.setProperty("/Campaigns", aCampaigns);
                // Error handling
                if(bResponse === true){
                    this.onCampaignCreateSuccess(sCampaignName);
                } else {
                    this.getView().byId("statusErrorCreateCampaign").setVisible(true);
                }
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
