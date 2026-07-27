sap.ui.define([
    "sudeep/inventorytransfer/controller/BaseController",
    "sap/ui/model/json/JSONModel",
    "sap/m/MessageToast",
    "sap/m/MessageBox",
    "sap/m/MessageStrip",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator"
], function (BaseController, JSONModel, MessageToast, MessageBox, MessageStrip, Filter, FilterOperator) {
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
                                location: oWarehouse ? oWarehouse.location : "Unknown Warehouse"
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
        },

        onSearchRequests: function(oEvent) {
            const sValue = oEvent.getParameter("newValue");
            const oTable = this.byId("requestTable");
            const oBinding = oTable.getBinding("items");
            
            if (sValue) {
                const oFilter = new Filter({
                    filters: [
                        new Filter("requestId", FilterOperator.Contains, sValue),
                        new Filter("location", FilterOperator.Contains, sValue)
                    ],
                    and: false
                });
                oBinding.filter(oFilter);
            } else {
                oBinding.filter([]);
            }
        }

    });

});