sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/m/MessageToast"
], (Controller, MessageToast) => {
    "use strict";

    return Controller.extend("sudeep.inventorytransfer.controller.VendorSupply", {
        onInit() {

            let oRouter = this.getOwnerComponent().getRouter();
            oRouter.getRoute("RouteVendorSupply").attachPatternMatched(this._onRouteMatched, this);

        },

        _onRouteMatched: function(oEvent) {
            const sTicketId = oEvent.getParameter("arguments").ticketId;
            const oModel = this.getOwnerComponent().getModel("tickets");
            const aTickets = oModel.getProperty("/tickets");
            const oSelectedTicket = aTickets.find(ticket => ticket.ticketId === Number(sTicketId));

            if (oSelectedTicket) {
                this.getView().setModel(new sap.ui.model.json.JSONModel(oSelectedTicket), "selectedTicket");
                MessageToast.show(`Loaded details for ticket ${sTicketId}.`);
            } else {
                // Handle case where ticket is not found (optional)
                sap.m.MessageToast.show("Ticket not found.");
            }
        },

        onNavBack: function () {
            this.getOwnerComponent().getRouter().navTo("RouteVendorTickets");
        },

        onAddToWarehouse: function () {
            // Implement logic to add the requested quantity to the warehouse inventory
            MessageToast.show("Add to Warehouse functionality is not implemented yet.");
        }
    });
});