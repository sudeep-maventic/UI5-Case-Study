sap.ui.define([
    "sap/ui/core/mvc/BaseController",
    "sap/m/MessageToast",
    "sap/m/MessageBox",
    "sap/ui/model/formatter"
], (BaseController, MessageToast, MessageBox, formatter) => {
    "use strict";

    return BaseController.extend("sudeep.inventorytransfer.controller.Signup", {
        formatter: formatter,

        onInit() {
        },

        onSignUpPress: function () {
            const oSignupModel = this.getOwnerComponent().getModel("signup");

            let oUsersData = JSON.parse(localStorage.getItem("users")) || { users: [] };  

            const aUsers = oUsersData.users || [];

            const bUserExists = aUsers.some(user =>
                user.email === oSignupModel.getProperty("/email")
            );

            if (bUserExists) {
                MessageBox.error("Email already exists. Please use a different email.");
                return;
            }

            // Generate a unique ID for the new user
            const sUserID = "EMP" + (aUsers.length + 1).toString().padStart(3, "0");

            let sWarehouseId = "";
            let sVendorId = "";

            if(oSignupModel.getProperty("/role") === "Warehouse Manager") {
                sWarehouseId = "WH" + (aUsers.filter(user => user.role === "Warehouse Manager").length + 1).toString().padStart(3, 0);
            } else if(oSignupModel.getProperty("/role") === "Vendor") {
                sVendorId = "V" + (aUsers.filter(user => user.role === "Vendor").length + 1).toString().padStart(3, 0);
            }

            aUsers.push({
                id: sUserID,
                name: oSignupModel.getProperty("/name"),
                email: oSignupModel.getProperty("/email"),
                password: oSignupModel.getProperty("/password"),
                role: oSignupModel.getProperty("/role"),
                company: oSignupModel.role === 'Vendor' ? oSignupModel.getProperty("/company") : "",
                location: oSignupModel.role === 'Warehouse Manager' ? oSignupModel.getProperty("/location") : "",
                warehouseId: sWarehouseId,
                vendorId: sVendorId
            });

            // Save to localStorage 
            localStorage.setItem("users", JSON.stringify({users: aUsers}));

            MessageToast.show("Signup Successful");
            const oRouter = this.getOwnerComponent().getRouter();
            oRouter.navTo("RouteLogin");

            oSignupModel.setData({
                name: "",
                email: "",
                password: "",
                role: "",
                company: "",
                location: ""
            });
        },

        onNavBack: function () {
            const oRouter = this.getOwnerComponent().getRouter();
            oRouter.navTo("RouteLogin");
        }
    });
});