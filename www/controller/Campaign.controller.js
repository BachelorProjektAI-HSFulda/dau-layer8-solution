sap.ui.define([
    "hs/fulda/customer/management/controller/BaseController",
    "jquery.sap.global",
    "sap/m/Button",
	"sap/m/Dialog",
    "sap/ui/model/json/JSONModel",
], function (BaseController, JQuery, Button, Dialog, JSONModel) {
    "use strict";

    return BaseController.extend("hs.fulda.customer.management.controller.Campaign", {

        /**
         * Lifecycle Method which is called at the first start of the App
         */
        onInit: function(){
            // Set style class cozy
            this.getView().addStyleClass("cozy");
            // Subscribe to event bus
            var oEventBus = sap.ui.getCore().getEventBus();
            oEventBus.subscribe("DataSetToModel", "DataReceived", this._refresh, this);
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
            var iCampaignId;

            if(!this.getView().byId("campaignList").getBinding("items").getLength()){
                iCampaignId = 1;
            } else {
                iCampaignId = this.getView().byId("campaignList").getBinding("items").getLength()+1;
            }

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
                    var bValueSet = oModel.setProperty("/Campaigns");

                    if(bValueSet === true){
                        var aCampaigns = [];
                    }
                } else {
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
            // Save Data persistent
            var JSONData = this.getView().getModel().getJSON();
            this.saveData(JSONData);
            // Nav back to list page
            var animation = "show";
            navCon.to(this.getView().byId("pageShowCampaigns"), animation);
            this.getView().byId("inputCampaignName").setValue("");
            this.getView().byId("inputCampaignDesc").setValue("");
        },

        _refresh: function(sChannelId, sEventId, json){
            console.log(json);
            var oModel = new JSONModel();
            // Set data to the model
            oModel.setData(json);
            // Assign the model object to the SAPUI5 core
			this.getOwnerComponent().setModel(oModel);
            // Set Binding mode
            this.getOwnerComponent().getModel().setDefaultBindingMode(sap.ui.model.BindingMode.TwoWay);
        }
	});
});
