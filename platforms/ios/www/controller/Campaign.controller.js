sap.ui.define([
    "hs/fulda/customer/management/controller/BaseController",
    "jquery.sap.global",
    "sap/m/Button",
	"sap/m/Dialog",
    "sap/ui/model/json/JSONModel",
    "sap/ui/core/routing/History",
    "sap/m/MessageToast",
    "sap/ui/model/Filter",
    "sap/m/MessageBox"
], function (BaseController, JQuery, Button, Dialog, JSONModel, History, MessageToast, Filter, MessageBox) {
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
            this.initClarifai();
            console.log("onTest");
            this.requestFileSystem();
        },
        /**
         * Filter for campaign list
         * @public
         */
        onSearch: function(oEvent){
            // add filter for search
			var aFilters = [];
			var sQuery = oEvent.getSource().getValue();
			if (sQuery && sQuery.length > 0) {
				var filter = new Filter("CampaignName", sap.ui.model.FilterOperator.Contains, sQuery);
				aFilters.push(filter);
			}

			// update list binding
			var list = this.getView().byId("campaignList");
			var binding = list.getBinding("items");
			binding.filter(aFilters, "Application");
        },
        /**
         * This method allows multi delete for campaigns
         * @public
         */
        onDeleteCampaign: function(oEvent){
            var bCompact = !!this.getView().$().closest(".sapUiSizeCompact").length;
            var that = this;

			MessageBox.warning(
				this.getResourceBundle().getText("deleteQuestion"),
				{
					actions: [sap.m.MessageBox.Action.OK, sap.m.MessageBox.Action.CANCEL],
					styleClass: bCompact ? "sapUiSizeCompact" : "",
					onClose: function(sAction) {
						if(sAction === "OK"){
                            var aCampaignItems = that.getView().byId("campaignList").getSelectedItems();

                            for(var i=aCampaignItems.length-1; i >= 0 ; i--){
                                var oItemContextPath = aCampaignItems[i].getBindingContext().getPath();
                                var aPathParts = oItemContextPath.split("/");
                                var iIndex = aPathParts[aPathParts.length - 1];
                                var oJSONData = that.getView().getModel().getData();
                                oJSONData.Campaigns.splice(iIndex, 1); //Use splice to remove your object in the array
                                that.getView().getModel().setData(oJSONData); //And set the new data to the model
                            }

                            // Save Data persistent
                            var JSONData = that.getView().getModel().getJSON();
                            that.saveData(JSONData);
                            // Toggle Campaign List
                            that.onToggleDeleteCampaign();
                        }
					}
				}
			);
        },

        /**
         * This method toggles the delete state in the campaign view
         * @public
         */
        onToggleDeleteCampaign: function(){
            var mode = this.getView().byId("campaignList").getMode();
            if(mode === "MultiSelect"){

                //this.getView().byId("campaignList").attachItemPress(this.onCampaignItemPressed);
                this.getView().byId("idBtnDelete").setVisible(false);
                this.getView().byId("idBtnToggleDelete").setIcon("sap-icon://delete");
                mode = "None";
            } else {
                //this.getView().byId("campaignList").detachItemPress(this.onCampaignItemPressed);
                this.getView().byId("idBtnDelete").setVisible(true);
                this.getView().byId("idBtnToggleDelete").setIcon("sap-icon://save");
                mode = "MultiSelect";
            }
			this.getView().byId("campaignList").setMode(mode);
        },

        /**
         * Adds a campaign in the app
         * @public
         */
        onAddCampaign: function(oEvent){
            this.getView().byId("statusErrorCreateCampaign").setVisible(false);
            this.getView().byId("statusInformationCreateCampaign").setVisible(false);

            // request Filesystem -->Pre-Fix
            // WICHTIg: muss noch ordentlich gemacht werden
            this.requestFileSystem();

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

        /**
         * Edit Campaign
         * @public
         */
        onEditCampaign: function(oEvent){
            var oList = oEvent.getSource().getParent();
            this.editDialog = this.getView().byId("");
            // Read actual campaign object
            var oCampaign = this.getView().getModel().getProperty(oList.getSwipedItem().getBindingContextPath());
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
        /**
         * Saves the campaign after changes from the user
         * @public
         */
        onSaveCampaignAfterEdit: function(sCampaignName){
            // Save Data persistent
            var JSONData = this.getView().getModel().getJSON();
            this.saveData(JSONData);
            // Nav back to list page
            this.editDialog.close();
            this.getOwnerComponent().getModel().refresh(true);
        },
        /**
         * Cancel edit campaign
         * @public
         */
        onEditCampaignCancel: function(){
            // Nav back to list page
            this.editDialog.close();
        },

        onCampaignItemPressed: function(oEvent){
            var oItem = oEvent.getSource();
			var oRouter = this.getRouter();
            var sPath = oItem.getBindingContext().getPath();

            var iCampaignId = sPath.substr(11, 1);

			oRouter.navTo("Customer", {
				CampaignId: iCampaignId
			});
        },

        onSaveCampaign: function(oEvent){

            console.log(this.getView().getModel());
            var iCampaignId;
            var binding = this.getView().byId("campaignList").getBinding("items");

            if(binding === undefined){
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
                // Not needed anymore
                //this.getView().byId("statusInformationCreateCampaign").setVisible(true);
                if(sCampaignName === null || sCampaignName === undefined || sCampaignName === ""){
                    this.getView().byId("inputCampaignName").setValueState(sap.ui.core.ValueState.Error);
                    this.getView().byId("inputCampaignName").setValueStateText(this.getResourceBundle().getText("pleaseEnterCampaignName"));
                }  else {
                    this.getView().byId("inputCampaignName").setValueState(sap.ui.core.ValueState.None);
                }

                if(sCampaignDesc === null || sCampaignDesc === undefined || sCampaignDesc === ""){
                    this.getView().byId("inputCampaignDesc").setValueState(sap.ui.core.ValueState.Error);
                    this.getView().byId("inputCampaignDesc").setValueStateText(this.getResourceBundle().getText("pleaseEnterDescription"));
                } else {
                    this.getView().byId("inputCampaignDesc").setValueState(sap.ui.core.ValueState.None);
                    this.getView().byId("inputCampaignDesc").setValueStateText("");
                }
            } else {
                this.getView().byId("inputCampaignName").setValueState(sap.ui.core.ValueState.None);
                this.getView().byId("inputCampaignName").setValueStateText("");
                this.getView().byId("inputCampaignDesc").setValueState(sap.ui.core.ValueState.None);
                this.getView().byId("inputCampaignDesc").setValueStateText("");
                // Set data
                oNewCampaignData.CampaignName = sCampaignName;
                oNewCampaignData.Description = sCampaignDesc;

                if(iCampaignId === 1){
                    console.log(this.getView().getModel());
                    var bValueSet = oModel.setProperty("/Campaigns");
                      console.log(this.getView().getModel());
                    //if(bValueSet === true){
                        var aCampaigns = [];
                    //}
                } else {
                    var aCampaigns = oModel.getProperty("/Campaigns");
                }
                // Push data to array
                aCampaigns.push(oNewCampaignData);
                console.log(this.getView().getModel());
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
            MessageToast.show("_refresh");
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
