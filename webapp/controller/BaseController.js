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
        },

        onEmailChange: function(oEvent) {
            const sEmail = oInput.getValue().trim();
            const oRegex = '/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[A-Za-z]{2,}$/';

             if (sEmail === "") {
                oInput.setValueState(sap.ui.core.ValueState.None);
                oInput.setValueStateText("");
            } else if (oRegex.test(sEmail)) {
                oInput.setValueState(sap.ui.core.ValueState.Success);
                oInput.setValueStateText("");
            } else {
                oInput.setValueState(sap.ui.core.ValueState.Error);
                oInput.setValueStateText("Please enter a valid email address.");
            }
        }

    })
})