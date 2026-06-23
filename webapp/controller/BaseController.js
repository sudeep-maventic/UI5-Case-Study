sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/m/MessageToast",
    "sap/m/MessageBox"
], (Controller, MessageToast, MessageBox) => {
    "use strict";

    return Controller.extend("sudeep.inventorytransfer.controller.BaseController", {
        onInit() {
        },

        getRouter() {
            return this.getOwnerComponent().getRouter();
        },

        showToast: function(sMessage) {
            MessageToast.show(sMessage);
        },

        showError: function(sMessage) {
            MessageBox.error(sMessage);
        },

        showWarning: function(sMessage) {
            MessageBox.warning(sMessage);
        },

        getCurrentUser: function() {
            return JSON.parse(localStorage.getItem("currentUser")) || null;
        },

        getUsers: function() {
            return JSON.parse(localStorage.getItem("users")) || { users: [] };
        }

    })
})