sap.ui.define([
    "sudeep/inventorytransfer/controller/BaseController",
    "sap/m/MessageToast",
    "sap/m/MessageBox",
    "sap/ui/model/json/JSONModel",
], (BaseController, MessageToast, MessageBox, JSONModel) => {
    "use strict";

    return BaseController.extend("sudeep.inventorytransfer.controller.Dashboard", {
        onInit: function() {
            this.getOwnerComponent().getRouter().getRoute("RouteDashboard").attachPatternMatched(this._onRouteMatched, this);
            
        },

        _onRouteMatched: function() {
            const oCurrentUser = JSON.parse(localStorage.getItem("currentUser"));

            const oProductsModel = this.getOwnerComponent().getModel("products").getProperty("/products") || [];
            const aProducts = oProductsModel.filter(product => product.warehouseId === oCurrentUser.warehouseId);

            const oDashboardModel = {
                managerName: oCurrentUser.name,
                totalProducts: aProducts.length,
                completedTransfers: 5,
                pendingTransfers: 3,
                rejectedTransfers: 5,
                lowStock: 10,
                electronics: 45,
                furniture: 30,
                accessories: 25,
                clothing: 10
            }

            this.getView().setModel(new JSONModel(oDashboardModel), "dashboard");
        }
    })
})