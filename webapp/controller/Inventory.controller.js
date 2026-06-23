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
                    this.getOwnerComponent().getRouter().navTo("RouteDashboard");
                    break;
                case "profile":
                    this.getOwnerComponent().getRouter().navTo("RouteVendorProfile");
                    break;
                case "key4":
                    this.getOwnerComponent().getRouter().navTo("RouteVendor");
                    break;
                default:
                    MessageToast.show("Unknown navigation item selected.");
            }
        }
    });
});