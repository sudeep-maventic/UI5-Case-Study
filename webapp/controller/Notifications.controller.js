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
            this.byId("notificationsPage").setShowNavButton(
                oCurrentUser?.role === "Vendor"
            );
            this._sSearch = "";
            this._sFilter = "All";
            console.log(oCurrentUser.role);
        },

        onSearch: function(oEvent) {
            this._sSearch = oEvent.getParameter("newValue");
            this._applyFilters();
        },

        onNavBack: function () {
            const oRouter = this.getRouter();
            oRouter.navTo("RouteVendor");
        },

        onFilterChange: function(oEvent) {
            this._sFilter = oEvent.getParameter("item").getKey();
            this._applyFilters();
        },

        _applyFilters: function() {
            const oBinding = this.getView().byId("notificationsList").getBinding("items");
            const aFilters = [];

            if (this._sSearch) {
                aFilters.push(new Filter({
                    filters: [
                        new Filter("title", FilterOperator.Contains, this._sSearch),
                        new Filter("message", FilterOperator.Contains, this._sSearch)
                    ],
                    and: false
                }));
            }

            if(this._sFilter === 'Read') {
                aFilters.push(new Filter("read", FilterOperator.EQ, true));
            }else if(this._sFilter === 'Unread') {
                aFilters.push(new Filter("read", FilterOperator.EQ, false));
            }

            oBinding.filter(aFilters);
        }
    });
});