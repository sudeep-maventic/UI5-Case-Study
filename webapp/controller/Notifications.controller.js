sap.ui.define([
    "sudeep/inventorytransfer/controller/BaseController",
    "sap/ui/model/json/JSONModel",
    "sap/m/MessageToast",
    "sap/m/MessageBox",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator"
], (BaseController, JSONModel, MessageToast, MessageBox, Filter, FilterOperator) => {
    "use strict";

    return BaseController.extend("sudeep.inventorytransfer.controller.Notifications", {
        onInit() {
            const oCurrentUser = this.getCurrentUser();
            const aNotifications = this.getOwnerComponent().getModel("notifications").getProperty("/notifications") || [];
            const aUserNotifications = aNotifications.filter(notification => notification.userId === (oCurrentUser.warehouseId || oCurrentUser.vendorId));
            this.getView().setModel(new JSONModel({ notifications: aUserNotifications }), "userNotifications");
            console.log("User Notifications:", aUserNotifications);
            console.log(oCurrentUser.vendorId);
        },

        onSearch: function(oEvent) {
            const sValue = oEvent.getParameter("newValue");
            const oBinding = this.getView().byId("notificationList").getBinding("items");

            if (!sValue) {
                oBinding.filter([]);
                return;
            }

            const aFilters = [
                new Filter("title", FilterOperator.Contains, sValue)
            ];
            oBinding.filter(aFilters);
        }
    });
});