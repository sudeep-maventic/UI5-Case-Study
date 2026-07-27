sap.ui.define([
    "sudeep/inventorytransfer/controller/BaseController",
    "sap/ui/model/json/JSONModel",
    "sap/m/MessageToast",
    "sap/m/MessageBox",
    "sap/ui/core/Fragment",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator",
    "sudeep/inventorytransfer/model/formatter"
], (BaseController, JSONModel, MessageToast, MessageBox, Fragment, Filter, FilterOperator, formatter) => {
    "use strict";

    return BaseController.extend("sudeep.inventorytransfer.controller.Notifications", {

        formatter: formatter,

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
        },

         onNotificationPress: async function (oEvent) {
            const oItem = oEvent.getParameter("listItem");
            const oContext = oItem.getBindingContext("userNotifications");

            if(!this._oNotificationDialog) {
                this._oNotificationDialog = await Fragment.load({
                    id: this.getView().getId(),
                    name: "sudeep.inventorytransfer.fragments.NotificationDialog",
                    controller: this
                });
                
                this.getView().addDependent(this._oNotificationDialog);
            }

            this._oNotificationDialog.setBindingContext(oContext, "userNotifications");
            const oModel = this.getView().getModel("userNotifications");
            const sPath = oContext.getPath();

            if (!oModel.getProperty(sPath + "/read")) {
                oModel.setProperty(sPath + "/read", true);
                oModel.refresh(true);
            }
            
            this._oNotificationDialog.open();

        },

        onCloseNotification: function () {

            this._oNotificationDialog.close();

        }
    });
});