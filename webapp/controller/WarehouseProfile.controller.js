sap.ui.define([
    "sudeep/inventorytransfer/controller/BaseController",
    "sap/m/MessageToast",
    "sap/m/MessageBox"
], function (BaseController, MessageToast, MessageBox) {
    "use strict";

    return BaseController.extend("sudeep.inventorytransfer.controller.WarehouseProfile", {

        onInit: function() {
            const oCurrentUser = this.getCurrentUser();
            if (!oCurrentUser) {
                this.showError("No user logged in. Please log in to view warehouse profile.");
                this.getRouter().navTo("login");
                return;
            }

            const oProfileModel = new sap.ui.model.json.JSONModel({ oCurrentUser });
            this.getView().setModel(oProfileModel, "profile");

            const oViewStateModel = new sap.ui.model.json.JSONModel({ editMode: false });
            this.getView().setModel(oViewStateModel, "viewState");
        },

        onEditProfilePress: function() {
            this.getView().getModel("viewState").setProperty("/editMode", true); 
        }, 

        onCancelEditPress: function() {
            const oCurrentUser = this.getCurrentUser();
            this.getView().getModel("profile").setProperty("/oCurrentUser", oCurrentUser);
            this.getView().getModel("viewState").setProperty("/editMode", false); 
        },

        onSaveProfilePress: function() {
            const oProfileModel = this.getView().getModel("profile");
            const oCurrentUser = oProfileModel.getProperty("/oCurrentUser");
            const oUsersData = this.getUsers();

            localStorage.setItem("currentUser", JSON.stringify(oCurrentUser));

            const userIndex = oUsersData.users.findIndex(user => user.email === oCurrentUser.email);
            if (userIndex !== -1) {
                oUsersData.users[userIndex] = oCurrentUser;
                localStorage.setItem("users", JSON.stringify(oUsersData));
            } else {
                this.showError("User not found in the system.");
                return;
            }

            localStorage.setItem("users", JSON.stringify(oUsersData));

            this.showToast("Profile updated successfully");
            this.getView().getModel("viewState").setProperty("/editMode", false);
        }     
    });
});