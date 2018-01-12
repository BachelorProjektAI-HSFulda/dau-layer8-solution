sap.ui.define([
    "hs/fulda/customer/management/controller/BaseController",
    "jquery.sap.global",
    "sap/m/Button",
	"sap/m/Dialog",
	"sap/m/Text",
    "sap/m/MessageToast"
], function (BaseController) {
    "use strict";

    return BaseController.extend("hs.fulda.customer.management.controller.Settings", {
        onInit: function(){
            // Set style class cozy
            this.getView().addStyleClass("cozy");
        },

        onGeneralPressed: function(oEvent) {
            var navCon = this.getView().byId("navContainerSettings");
            var target = oEvent.getSource().data("target");
            if (target) {
                var animation = "show";
                navCon.to(this.getView().byId(target), animation);
            } else {
                navCon.back();
            }
        },

        onAppPressed: function(oEvent) {
            var navCon = this.getView().byId("navContainerSettings");
            var target = oEvent.getSource().data("target");
            if (target) {
                var animation = "show";
                navCon.to(this.getView().byId(target), animation);
            } else {
                navCon.back();
            }
        },
        onNetworkPressed: function(oEvent) {
            var navCon = this.getView().byId("navContainerSettings");
            var target = oEvent.getSource().data("target");
            if (target) {
                var animation = "show";
                navCon.to(this.getView().byId(target), animation);
            } else {
                navCon.back();
            }
        },

        onPageBack: function(oEvent){
            var sID = oEvent.getId();
            if (sID !== "navButtonPress") {
                if (!navCon) {
                    var navCon = this.getView().byId("navContainerSettings");
                }
                var target = oEvent.getSource().data("target");
                if (target) {
                    var animation = "show";
                    navCon.to(this.getView().byId(target), animation);
                }
            } else {
                this.onNavBack();
            }
        }
	});
});
