sap.ui.define([
    "sudeep/inventorytransfer/controller/BaseController",
    "sap/ui/model/json/JSONModel",
    "sap/m/MessageToast",
    "sap/m/MessageBox",
    "sudeep/inventorytransfer/model/formatter"
], (BaseController, JSONModel, MessageToast, MessageBox, formatter) => {
    "use strict";

    return BaseController.extend("sudeep.inventorytransfer.controller.Inventory", {

        formatter: formatter,

        onInit() {
            const oCurrentUser = this.getCurrentUser();
            const sVendorId = oCurrentUser.vendorId;

            const aRequests = this.getOwnerComponent().getModel("vendorRequests").getProperty("/vendorRequests") || [];
            const aVendorRequests = aRequests.filter(request => request.vendorId === sVendorId);

            const aVendors = this.getOwnerComponent().getModel("vendors").getProperty("/vendors") || [];
            const oVendor = aVendors.find(vendor => vendor.vendorId === sVendorId);

            const oDashboardModel = {
                company: oVendor ? oVendor.company : "",
                pending: aVendorRequests.filter(request => request.status === "Pending").length,
                accepted: aVendorRequests.filter(request => request.status === "Accepted").length,
                rejected: aVendorRequests.filter(request => request.status === "Rejected").length,
                products: oVendor ? oVendor.items.length : 0,
                recentRequests: aVendorRequests.slice(-5).reverse()
            }

            this.getView().setModel(new JSONModel(oDashboardModel), "dashboard");
        },

        onNavBack: function () {
            const oRouter = this.getOwnerComponent().getRouter();
            oRouter.navTo("RouteLogin");
        }, 

        onWarehouseRequests: function() {
            const oRouter = this.getRouter();
            oRouter.navTo("RouteWarehouseRequests");
        },

        onMyProfile: function() {
            const oRouter = this.getRouter();
            oRouter.navTo("RouteVendorProfile");
        },

        onLogout: function () {
            sap.m.MessageBox.confirm("Are you sure you want to logout?", {
                actions: [sap.m.MessageBox.Action.OK, sap.m.MessageBox.Action.CANCEL],
                emphasizedAction: sap.m.MessageBox.Action.OK,

                onClose: (sAction) => {
                    if (sAction === sap.m.MessageBox.Action.OK) {
                    localStorage.removeItem("currentUser");
                    this.getRouter().navTo("RouteLogin");
                    this.showToast("Logged out successfully.");
                    }
                }
            });
        },
        
        onNotifications: function() {
            const oRouter = this.getRouter();
            oRouter.navTo("RouteNotifications");
        }
    });
});