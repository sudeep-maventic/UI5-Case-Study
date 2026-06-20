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
                MessageToast.show("Login Successful");
            } else {
                MessageBox.error("Invalid Email or Password");
            }
        },

        onSignUpPress: function () {
            const oRouter = this.getOwnerComponent().getRouter();
            oRouter.navTo("RouteSignup");
        }

    });
});