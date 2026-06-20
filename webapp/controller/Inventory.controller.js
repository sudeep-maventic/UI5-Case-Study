sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/m/MessageToast",
    "sap/m/MessageBox"
], (Controller, MessageToast, MessageBox) => {
    "use strict";

    return Controller.extend("sudeep.inventorytransfer.controller.Inventory", {
        onInit() {
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

            switch (sKey) {
                case "key1":
                    this.getOwnerComponent().getRouter().navTo("RouteInventory");
                    break;
                case "key2":
                    this.getOwnerComponent().getRouter().navTo("RouteInventory");
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