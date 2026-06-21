sap.ui.define([
    "sap/ui/core/mvc/Controller"
], (Controller) => {
    "use strict";

    return Controller.extend("sudeep.inventorytransfer.controller.VendorProfile", {
        onInit() {
        },
    
        onNavBack: function () {    
            this.getOwnerComponent().getRouter().navTo("RouteVendor");
        },

        onEditProfile: function () {
            // Implement logic to edit vendor profile
            sap.m.MessageToast.show("Edit Profile functionality is not implemented yet.");
        }
    });
});