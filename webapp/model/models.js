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
                location: ""
            });
        },

        createUserModel: function() {
            return new JSONModel(sap.ui.require.toUrl("sudeep/inventorytransfer/model/users.json"));
        },

        
        createTicketModel: function() {
            return new JSONModel(sap.ui.require.toUrl("sudeep/inventorytransfer/model/tickets.json"));
        },

        createSupplyModel: function() {
            return new JSONModel(sap.ui.require.toUrl("sudeep/inventorytransfer/model/supplyHistory.json"));
        },

        createWarehouseModel: function() {  
            return new JSONModel(sap.ui.require.toUrl("sudeep/inventorytransfer/model/warehouseProducts.json"));
        }
    };

});