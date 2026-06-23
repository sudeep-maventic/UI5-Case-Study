sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/m/MessageToast",
    "sap/m/MessageBox",
    "sap/ui/model/json/JSONModel",
], (Controller, MessageToast, MessageBox, JSONModel) => {
    "use strict";

    return Controller.extend("sudeep.inventorytransfer.controller.Dashboard", {
        onInit: function() {
            const oCurrentUser = JSON.parse(localStorage.getItem("currentUser"));
            const sWarehouseId = oCurrentUser ? oCurrentUser.warehouseId : null;
            
        }
    })
})