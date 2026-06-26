sap.ui.define([
    "sudeep/inventorytransfer/controller/BaseController",
    "sap/ui/model/json/JSONModel"
], (BaseController, JSONModel) => {
    "use strict";

    return BaseController.extend("sudeep.inventorytransfer.controller.VendorProfile", {
        onInit() {
            const oCurrentUser = this.getCurrentUser();
            const aVendors = this.getOwnerComponent().getModel("vendors").getProperty("/vendors") || [];

            const oVendor = aVendors.find(vendor => vendor.vendorId === oCurrentUser.vendorId);

            const oProfileData = {
                name: oCurrentUser.name || "",
                email: oCurrentUser.email || "",
                vendorId: oCurrentUser.vendorId || "",
                company: oVendor ? oVendor.company : "",
                contactEmail: oVendor ? oVendor.contactEmail : "",
                address: oVendor.address,
                phone: oVendor.phone
            }

            this.getView().setModel(new JSONModel(oProfileData), "profile");

            this.getView().setModel(new JSONModel({
                editMode: false
            }), "viewState");

        },
    
        onNavBack: function () {    
            this.getOwnerComponent().getRouter().navTo("RouteVendor");
        },

        onEditProfile: function () {
            this.getView().getModel("viewState").setProperty("/editMode", true);
        },

        onSaveProfile: function() {
            const oProfileModel = this.getView().getModel("profile").getData();
            const aUsers = JSON.parse(localStorage.getItem("users")).users;

            const iIndex = aUsers.findIndex(user => user.vendorId === oProfileModel.vendorId);
            if (iIndex !== -1) {
                aUsers[iIndex].name = oProfileModel.name;
                aUsers[iIndex].email = oProfileModel.email;
            }

            localStorage.setItem("users", JSON.stringify({ users: aUsers }));
            localStorage.setItem("currentUser", JSON.stringify(aUsers[iIndex]));

            this.getView().getModel("viewState").setProperty("/editMode", false);
            this.showToast("Profile updated successfully!");

        },

        oncancel: function() {
            const oCurrentUser = this.getCurrentUser();
            const aVendors = this.getOwnerComponent().getModel("vendors").getProperty("/vendors") || [];
            const oVendor = aVendors.find(vendor => vendor.vendorId === oCurrentUser.vendorId);

            this.getView().getModel("profile").setData({
                name: oCurrentUser.name,
                email: oCurrentUser.email,
                vendorId: oCurrentUser.vendorId,
                company: oVendor ? oVendor.company : "",
                address: oVendor ? oVendor.address : "",
                phone: oVendor ? oVendor.phone : "",
                contactEmail: oVendor ? oVendor.contactEmail : ""

            })

            this.getView().getModel("viewState").setProperty("/editMode", false);
        }
    });
});