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

        onTicketPress: function () {
            const oRouter = this.getOwnerComponent().getRouter();
            oRouter.navTo("RouteVendorTickets");
        },

        onSupplyPress: function () {
            const oRouter = this.getOwnerComponent().getRouter();
            oRouter.navTo("RouteVendorSupply");
        },

        onProfilePress: function () {
            const oRouter = this.getOwnerComponent().getRouter();
            oRouter.navTo("RouteVendorProfile");
        },

        onHistoryPress: function () {
            const oRouter = this.getOwnerComponent().getRouter();
            oRouter.navTo("RouteVendorHistory");
        }
    });
});