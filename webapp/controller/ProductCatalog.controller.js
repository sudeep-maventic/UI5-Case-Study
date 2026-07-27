sap.ui.define([
    "sudeep/inventorytransfer/controller/BaseController",
    "sap/ui/model/json/JSONModel",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator"
], function (
    BaseController,
    JSONModel,
    Filter,
    FilterOperator
) {
    "use strict";

    return BaseController.extend("sudeep.inventorytransfer.controller.ProductCatalog", {

        onInit: function () {
            const oCurrentUser = this.getCurrentUser();
            if (!oCurrentUser) {
                this.showError("User session not found.");
                return;
            }
            const sVendorId = oCurrentUser.vendorId;
            const aVendors = this.getOwnerComponent().getModel("vendors").getProperty("/vendors") || [];
            const oVendor = aVendors.find(function (oItem) {
                return oItem.vendorId === sVendorId;
            });
            if (!oVendor) {
                this.showError("Vendor not found.");
                return;
            }
            this.getView().setModel(
                new JSONModel({
                    products: oVendor.items
                }),
                "catalog"
            );
        },

        onSearch: function (oEvent) {
            const sValue = oEvent.getParameter("newValue");
            const oBinding = this.byId("tblProductCatalog").getBinding("items");
            if (!sValue) {
                oBinding.filter([]);
                return;
            }
            const oFilter = new Filter({
                filters: [
                    new Filter("productId", FilterOperator.Contains, sValue),
                    new Filter("productName", FilterOperator.Contains, sValue),
                    new Filter("category", FilterOperator.Contains, sValue)
                ],
                and: false
            });
            oBinding.filter(oFilter);
        },

        onRefresh: function () {
            this._loadVendorProducts();
            this.showToast("Product catalog refreshed successfully.");
        },

        onNavBack: function () {    
            this.getOwnerComponent().getRouter().navTo("RouteVendor");
        }

    });

});