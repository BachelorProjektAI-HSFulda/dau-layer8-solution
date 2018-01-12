sap.ui.define([
    "hs/fulda/customer/management/controller/BaseController",
    "jquery.sap.global",
    "sap/ui/model/json/JSONModel",
], function (BaseController, JQuery, JSONModel) {
    "use strict";

    return BaseController.extend("hs.fulda.customer.management.controller.Login", {

        /**
         * Lifecycle Method which is called at the first start of the App
         */
        onInit: function(){
            // Set style class cozy
            this.getView().addStyleClass("cozy");
            var oEventBus = sap.ui.getCore().getEventBus();
            oEventBus.subscribe("DataSetToModel", "DataReceived", this._refresh, this);
            // Set Icons
            this.getView().byId("flexBoxAppTitle").addStyleClass("flexBoxAppTitle");
        },

        /**
         * START: handle Google+ or Facebook login
         */
        onLoginPress: function(oEvent){

            var sProvider = oEvent.getSource().data("provider");
            switch(sProvider) {
                case "google":
                    window.plugins.googleplus.login(
                        {
                          'scopes': '', // optional, space-separated list of scopes, If not included or empty, defaults to `profile` and `email`.
                          'webClientId': '855269254217-5n7v4d9vqujeh6kn8cuoopab9ue5q02j.apps.googleusercontent.com', // optional clientId of your Web application from Credentials settings of your project - On Android, this MUST be included to get an idToken. On iOS, it is not required.
                          'offline': false, // optional, but requires the webClientId - if set to true the plugin will also return a serverAuthCode, which can be used to grant offline access to a non-Google server
                        },
                        function (obj) {
                            // obj Array Objekte:
                            // accessToken, displayName, email, familyName, givenName, idToken, imageUrl, refreshToken, serverAuthCode, userID

                            alert(JSON.stringify("Hallo " + obj.displayName + " du hast dich erfolgreich angemeldet."));
                            var sSecToken = obj.accessToken;
                            console.log(sSecToken);
                        },
                        function (msg) {
                            alert('error: ' + msg);
                        }
                    );
                    break;
                case "facebook":
                    CordovaFacebook.login({
                        permissions: ['email', 'user_likes'],
                        onSuccess: function(result) {
                            console.log(result);
                            if(result.declined.length > 0) {
                                alert("The User declined something!");
                            } else {
                                var oRouter = this.getRouter();
                                console.log(oRouter);
                                oRouter.navTo("Campaign");
                            }
                        },
                        onFailure: function(result) {
                            if(result.cancelled) {
                                alert("The user doesn't like my app");
                            } else if(result.error) {
                                alert("There was an error:" + result.errorLocalized);
                            }
                        }
                    });
                    break;
                default:
                    console.log("failure login provider");
            }
        },

        /**
         *
         */
        t: function(oEvent){
            // Read input values
            var sUserName = this.getView().byId("idUserName").getValue();
            var sPassword = this.getView().byId("idPassword").getValue();
            console.log(sUserName);
            console.log(sPassword);

            CordovaFacebook.login({
                permissions: ['email', 'user_likes'],
                onSuccess: function(result) {
                    console.log(result);
                    if(result.declined.length > 0) {
                        alert("The User declined something!");
                    } else {
                        var oRouter = this.getRouter();
                        console.log(oRouter);
                        oRouter.navTo("Campaign");
                    }
                },
                onFailure: function(result) {
                    if(result.cancelled) {
                        alert("The user doesn't like my app");
                    } else if(result.error) {
                        alert("There was an error:" + result.errorLocalized);
                    }
                }
            });
        },

        /**
         *
         */
        onSignIn: function(googleUser) {
          var profile = googleUser.getBasicProfile();
          console.log('ID: ' + profile.getId()); // Do not send to your backend! Use an ID token instead.
          console.log('Name: ' + profile.getName());
          console.log('Image URL: ' + profile.getImageUrl());
          console.log('Email: ' + profile.getEmail()); // This is null if the 'email' scope is not present.
        },

        /**
         *
         */
        signOut: function() {
            var auth2 = gapi.auth2.getAuthInstance();
            auth2.signOut().then(function () {
              console.log('User signed out.');
            });
        },
        /**
         *
         */
        googleLogout: function() {
            window.plugins.googleplus.logout(
                function (msg) {
                  document.querySelector("#image").style.visibility = 'hidden';
                  document.querySelector("#feedback").innerHTML = msg;
                },
                function (msg) {
                  document.querySelector("#feedback").innerHTML = msg;
                }
            );
        },
        /**
         *
         */
        navToCampaignView: function(){
            var oRouter = this.getRouter();
            console.log(oRouter);
            oRouter.navTo("Campaign");
        },

        /**
         *
         */
        _refresh: function(sChannelId, sEventId, json){
            var oModel = new JSONModel();
            // Set data to the model
            oModel.setData(json);
            // Assign the model object to the SAPUI5 core
			this.getOwnerComponent().setModel(oModel);
            // Set Binding mode
            this.getOwnerComponent().getModel().setDefaultBindingMode(sap.ui.model.BindingMode.TwoWay);
        },

        /**
         *
         */
        onPageBack: function(oEvent){
            var sID = oEvent.getId();
            if (sID !== "navButtonPress") {
                if (!navCon) {
                    var navCon = this.getView().byId("navContainerLoginPage");
                }
                var target = oEvent.getSource().data("target");
                if (target) {
                    var animation = "show";
                    navCon.to(this.getView().byId(target), animation);
                }
            } else {
                this.onNavBack();
            }
        },

        /**
         *
         */
        setLoginDomain: function(sLogin){
            localStorage.sLogin = sLogin;
        },

        /**
         *
         */
        getLoginDomain: function(bLogin){
            return localStorage.sLogin;
        }
	});
});
