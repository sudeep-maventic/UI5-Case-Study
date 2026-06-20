sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/m/MessageToast",
    "sap/m/MessageBox"
], (Controller, MessageToast, MessageBox) => {
    "use strict";

    return Controller.extend("sudeep.inventorytransfer.controller.Login", {
        onInit() {
        },

        onLoginPress: function () {

            const oLoginModel = this.getOwnerComponent().getModel("login");
            const oUsersModel = this.getOwnerComponent().getModel("users");

            const aUsers = oUsersModel.getData().users || [];

            const sUsername = oLoginModel.getProperty("/email");
            const sPassword = oLoginModel.getProperty("/password");

            const oUser = aUsers.find(user =>
                user.email === sUsername &&
                user.password === sPassword
            );

            if (oUser) {
                if (oUser.role === "Vendor") {
                    const oRouter = this.getOwnerComponent().getRouter();
                    oRouter.navTo("RouteVendor");
                } else if (oUser.role === "WarehouseManager") {
                    const oRouter = this.getOwnerComponent().getRouter();
                    oRouter.navTo("RouteInventory");
                }
                MessageToast.show("Login successful");

                oLoginModel.setProperty("/email", "");
                oLoginModel.setProperty("/password", "");

            } else {
                MessageBox.error("Invalid Email or Password");

                oLoginModel.setProperty("/email", "");
                oLoginModel.setProperty("/password", "");
            }
        },

        onSignUpPress: function () {
            const oRouter = this.getOwnerComponent().getRouter();
            oRouter.navTo("RouteSignup");
        }

    });
});