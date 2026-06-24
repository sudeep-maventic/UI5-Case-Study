sap.ui.define([
    "sap/ui/model/json/JSONModel",
    "sap/ui/Device"
], 
function (JSONModel, Device) {
    "use strict";

    return {
        /**
         * Provides runtime information for the device the UI5 app is running on as a JSONModel.
         * @returns {sap.ui.model.json.JSONModel} The device model.
         */
        createDeviceModel: function () {
            var oModel = new JSONModel(Device);
            oModel.setDefaultBindingMode("OneWay");
            return oModel;
        },

        createLoginModel: function() {
            return new JSONModel({
                email: "",
                password: ""
            });
        },

        createSignupModel: function() {
            return new JSONModel({
                name: "",
                email: "",
                password: "",
                role: "",
                company: "",
                location: "",
                warehouseId: "",
                vendorId: "",
            });
        },

        createUserModel: function() {
            return new JSONModel(sap.ui.require.toUrl("sudeep/inventorytransfer/model/users.json"));
        },

        createWarehouseModel: function() {
            return new JSONModel(sap.ui.require.toUrl("sudeep/inventorytransfer/model/warehouses.json"));
        },

        createProductsModel: function() {
            const oModel = new JSONModel();
            oModel.loadData(sap.ui.require.toUrl("sudeep/inventorytransfer/model/products.json"));
            return oModel;
        },

        createAddProductsModel: function() {
            return new JSONModel({
                productName: "",
                category: "",
                quantity: 0,
                price: 0.0,
                status: "Available"
            })
        },

        createTransferHistoryModel: function() {
            return new JSONModel(sap.ui.require.toUrl("sudeep/inventorytransfer/model/transfers.json"));
        },

        createTransferFormModel: function() {
            return new JSONModel({
                fromWarehouse: "",
                toWarehouse: "",
                items: [
                    {
                        productId: "",
                        productName: "",
                        quantity: 0
                    }
                ]
            });
        },

        createVendorRequestsModel: function() {
            return new JSONModel(sap.ui.require.toUrl("sudeep/inventorytransfer/model/vendorRequests.json"));
        },

        createVendorRequestsFormModel: function() {
            return new JSONModel({
                vendorId: "",
                requestedItems: [
                    {
                        productId: "",
                        productName: "",
                        price: 0
                    }
            ]
            })
        },

        createVendorsModel: function() {
            return new JSONModel(sap.ui.require.toUrl("sudeep/inventorytransfer/model/vendors.json"));
        },

        createTicketModel: function() {
            return new JSONModel(sap.ui.require.toUrl("sudeep/inventorytransfer/model/tickets.json"));
        },

        createSupplyModel: function() {
            return new JSONModel(sap.ui.require.toUrl("sudeep/inventorytransfer/model/supplyHistory.json"));
        },

        createWarehouseProductsModel: function() {  
            return new JSONModel(sap.ui.require.toUrl("sudeep/inventorytransfer/model/warehouseProducts.json"));
        }
    };

});