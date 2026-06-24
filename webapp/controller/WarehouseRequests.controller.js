sap.ui.define([
    "sudeep/inventorytransfer/controller/BaseController",
    "sap/ui/model/json/JSONModel",
    "sap/m/MessageToast",
    "sap/m/MessageBox",
    "sap/m/MessageStrip"
], function (BaseController, JSONModel, MessageToast, MessageBox, MessageStrip) {
    "use strict";

    return BaseController.extend("sudeep.inventorytransfer.controller.WarehouseRequests", {
        onInit: function() {
            const oCurrentUser = this.getCurrentUser();
            const sVendorId = oCurrentUser.vendorId;

            const aRequests = this.getOwnerComponent().getModel("vendorRequests").getProperty("/vendorRequests") || [];
            const aVendorRequests = aRequests.filter(request => request.vendorId === sVendorId);

            const oVendors = new JSONModel({requests: aVendorRequests});
            this.getView().setModel(oVendors, "warehouseRequests");
        },

        onViewRequest: function(oEvent) {
            const oSelectedItem = oEvent.getSource().getBindingContext("warehouseRequests").getObject();
            const sItems = oSelectedItem.requestedItems.map(item => `${item.productName} (Quantity: ${item.quantity}))`).join("\n");
            const sMessage = `Request ID: ${oSelectedItem.requestId}\nVendor ID: ${oSelectedItem.vendorId}\nStatus: ${oSelectedItem.status}\nRequested Items:\n${sItems}`;
            MessageBox.information(sMessage, {
                title: "Request Details",
                actions: [MessageBox.Action.OK]
            });
        },

        onAcceptRequest: function(oEvent) {
            const oSelectedItem = oEvent.getSource().getBindingContext("warehouseRequests").getObject();
            oSelectedItem.status = "Accepted";

            this.getView().getModel("warehouseRequests").refresh(true); 
            this.showToast("Request accepted successfully.");
        },

        onRejectRequest: function(oEvent) {
            const oSelectedItem = oEvent.getSource().getBindingContext("warehouseRequests").getObject();
            oSelectedItem.status = "Rejected";

            this.getView().getModel("warehouseRequests").refresh(true); 
            this.showToast("Request rejected successfully.");
        }

    });

});