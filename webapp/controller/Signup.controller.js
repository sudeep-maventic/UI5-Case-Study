sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/m/MessageToast",
    "sap/m/MessageBox"
], (Controller, MessageToast, MessageBox) => {
    "use strict";

    return Controller.extend("sudeep.inventorytransfer.controller.Signup", {
        onInit() {
        },

        onSignUpPress: function () {
            const oSignupModel = this.getOwnerComponent().getModel("signup");
            const oUsersModel = this.getOwnerComponent().getModel("users");

            const aUsers = oUsersModel.getData().users || [];

            const bUserExists = aUsers.some(user =>
                user.email === oSignupModel.getProperty("/email")
            );

            if (bUserExists) {
                MessageBox.error("Email already exists. Please use a different email.");
                return;
            }

            aUsers.push({
                name: oSignupModel.getProperty("/name"),
                email: oSignupModel.getProperty("/email"),
                password: oSignupModel.getProperty("/password"),
                role: oSignupModel.getProperty("/role"),
                company: oSignupModel.role === 'Vendor' ? oSignupModel.getProperty("/company") : "",
                location: oSignupModel.role === 'Warehouse Manager' ? oSignupModel.getProperty("/location") : ""
            });

            oUsersModel.setData({ users: aUsers });

            oUsersModel.refresh(true);

            MessageToast.show("Signup Successful");
            const oRouter = this.getOwnerComponent().getRouter();
            oRouter.navTo("RouteLogin");

            oSignupModel.setProperty("/name", "");
            oSignupModel.setProperty("/email", "");
            oSignupModel.setProperty("/password", "");
            oSignupModel.setProperty("/role", "");
            oSignupModel.setProperty("/company", "");
            oSignupModel.setProperty("/location", "");
        },

        onNavBack: function () {
            const oRouter = this.getOwnerComponent().getRouter();
            oRouter.navTo("RouteLogin");
        }
    });
});