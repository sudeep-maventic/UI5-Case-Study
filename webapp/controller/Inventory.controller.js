sap.ui.define([
    "sudeep/inventorytransfer/controller/BaseController",
    "sap/m/MessageToast",
    "sap/m/MessageBox"
], (BaseController, MessageToast, MessageBox) => {
    "use strict";

    return BaseController.extend("sudeep.inventorytransfer.controller.Inventory", {
        onInit() {
            const sUser = localStorage.getItem("currentUser");
            console.log("Local Storage User:", sUser);

            const oCurrentUser = JSON.parse(sUser);
            console.log("Parsed User:", oCurrentUser);

            const oUserModel = this.getOwnerComponent().getModel("user");
            console.log("User Model:", oUserModel);
        },

        onNavBack: function () {
            const oRouter = this.getOwnerComponent().getRouter();
            oRouter.navTo("RouteLogin");
        },

        onMenuButtonPress: function () {
            const oSideNavigation = this.byId("sideNavigation");
            oSideNavigation.setExpanded(!oSideNavigation.getExpanded());
        },

        onItemSelect: function (oEvent) {
            const sKey = oEvent.getParameter("item").getKey();
            const oNavContainer = this.byId("NavContainer");

            switch (sKey) {
                case "dashboard":
                    oNavContainer.to(this.byId("dashboardView"));
                    break;
                case "products":
                    oNavContainer.to(this.byId("productsView"));
                    break;
                case "profile":
                    oNavContainer.to(this.byId("profileView"));
                    break;
                case "transfer":
                    oNavContainer.to(this.byId("transferView"));
                    break;
                case "history":
                    oNavContainer.to(this.byId("historyView"));
                    break;
                case "transferDetails":
                    oNavContainer.to(this.byId("transferDetailsView"));
                    break;
                case "vendor":
                    oNavContainer.to(this.byId("vendorView"));
                    break;
                case "notifications":
                    oNavContainer.to(this.byId("notificationsView"));
                    break;
                default:
                    MessageToast.show("Unknown navigation item selected.");
            }
        },

        onProfilePress: function () {
            const oNavContainer = this.byId("NavContainer");
            oNavContainer.to(this.byId("profileView"));
        },

        onLogoutPress: function() {
            localStorage.removeItem("currentUser");
            this.getRouter().navTo("RouteLogin");
        }
    });
});