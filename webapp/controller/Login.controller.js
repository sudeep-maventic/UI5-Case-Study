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

            const sEmail = oLoginModel.getProperty("/email");
            const sPassword = oLoginModel.getProperty("/password");

            if(!sEmail || !sPassword) {
                MessageBox.error("Please enter Email and Password");
                return;
            }

            const Users = oUsersModel.getData().users || [];
            const oUsersData = JSON.parse(localStorage.getItem("users")) || { users: [] };
            const aLocalUsers = oUsersData.users || [];

            const aUsers = [...Users, ...aLocalUsers];

            const oUser = aUsers.find(user =>
                user.email === sEmail &&
                user.password === sPassword
            );

            if(!oUser) {
                MessageBox.error("Invalid Email or Password");
                return;
            }

            // Store the logged-in user in localStorage
            localStorage.setItem("currentUser", JSON.stringify(oUser));
            MessageToast.show("Login Successful");

            const oRouter = this.getOwnerComponent().getRouter();
            if(oUser.role === "Warehouse Manager") {
                oRouter.navTo("RouteInventory");
            } else if(oUser.role === "Vendor") {
                oRouter.navTo("RouteVendor");
            } else {
                MessageBox.error("Unknown user role");
            }

            oLoginModel.setData({
                email: "",
                password: ""
            });
        },

        onSignUpPress: function () {
            const oRouter = this.getOwnerComponent().getRouter();
            oRouter.navTo("RouteSignup");
        }

    });
});