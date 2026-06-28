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
            const aWarehouses = this.getOwnerComponent().getModel("warehouseProfile").getProperty("/warehouses") || [];

            const aVendorRequests = aRequests
                        .filter(request => request.vendorId === sVendorId)
                        .map(request => {
                            const oWarehouse = aWarehouses.find(warehouse => warehouse.warehouseId === request.warehouseId);
                            return {
                                ...request,
                                location: oWarehouse ? oWarehouse.warehouseName : "Unknown Warehouse"
                            };
                        });

            const oVendors = new JSONModel({requests: aVendorRequests});
            this.getView().setModel(oVendors, "warehouseRequests");
        },

        onViewRequest: function(oEvent) {
            const oRequest = oEvent.getSource().getBindingContext("warehouseRequests").getObject();
            this.getRouter().navTo("RouteVendorSupply", {
                requestId: oRequest.requestId
            }); 
        },

        onNavBack: function() {
            const oRouter = this.getOwnerComponent().getRouter();
            oRouter.navTo("RouteVendor");
        }

    });

});