sap.ui.define([
    "sudeep/inventorytransfer/controller/BaseController",
    "sap/ui/model/json/JSONModel"
], function (BaseController, JSONModel) {
    "use strict";

    return BaseController.extend("sudeep.inventorytransfer.controller.VendorRequests", {

        onInit: function () {

            this.getView().setModel(
                new JSONModel({
                    products: []
                }),
                "vendorProducts"
            );

            const oVendorFormModel = this.getOwnerComponent().getModel("vendorRequestsForm");

            this.getView().setModel(oVendorFormModel, "RequestsForm");
        },

        onVendorChange: function (oEvent) {

            const sVendorId = oEvent.getSource().getSelectedKey();

            const aVendors = this.getOwnerComponent().getModel("vendors").getProperty("/vendors") || [];

            const oVendor =
                aVendors.find(v => v.vendorId === sVendorId);

            this.getView()
                .getModel("vendorProducts")
                .setProperty(
                    "/products",
                    oVendor ? oVendor.products : []
                );
        },

        onAddItem: function () {

            const oFormModel =
                this.getView().getModel("vendorRequestsForm");

            const aItems =
                oFormModel.getProperty("/requestedItems") || [];

            aItems.push({
                productId: "",
                productName: "",
                price: 0,
                quantity: 1
            });

            oFormModel.setProperty("/requestedItems", aItems);
        },

        onRemoveItem: function (oEvent) {

            const sPath =
                oEvent.getSource()
                    .getBindingContext("vendorRequestsForm")
                    .getPath();

            const iIndex =
                parseInt(sPath.split("/")[2]);

            const oFormModel =
                this.getView().getModel("vendorRequestsForm");

            const aItems =
                oFormModel.getProperty("/requestedItems");

            aItems.splice(iIndex, 1);

            oFormModel.setProperty("/requestedItems", aItems);
        },

        onSubmitRequest: function () {

            const oFormModel =
                this.getView().getModel("vendorRequestsForm");

            const oRequest =
                oFormModel.getData();

            if (!oRequest.vendorId) {
                this.showError("Please select a vendor.");
                return;
            }

            if (!oRequest.requestedItems.length) {
                this.showError("Please add at least one product.");
                return;
            }

            const aVendors =
                this.getOwnerComponent()
                    .getModel("vendors")
                    .getProperty("/vendors") || [];

            const oVendor =
                aVendors.find(
                    v => v.vendorId === oRequest.vendorId
                );

            if (!oVendor) {
                this.showError("Vendor not found.");
                return;
            }

            const aRequestedItems = [];

            oRequest.requestedItems.forEach(function (oItem) {

                const oProduct =
                    oVendor.products.find(
                        p => p.productId === oItem.productId
                    );

                if (oProduct) {

                    aRequestedItems.push({
                        productId: oProduct.productId,
                        productName: oProduct.productName,
                        price: oProduct.price,
                        quantity: oItem.quantity || 1
                    });
                }
            });

            const oCurrentUser =
                this.getCurrentUser();

            const oVendorRequestModel =
                this.getOwnerComponent()
                    .getModel("vendorRequests");

            const aRequests =
                oVendorRequestModel.getProperty("/vendorRequests") || [];

            aRequests.push({
                requestId:
                    "VR" +
                    (aRequests.length + 1)
                        .toString()
                        .padStart(4, "0"),

                warehouseId: oCurrentUser.warehouseId,
                vendorId: oRequest.vendorId,
                status: "Pending",
                requestDate: new Date().toISOString(),
                requestedItems: aRequestedItems
            });

            oVendorRequestModel.setProperty(
                "/vendorRequests",
                aRequests
            );

            oVendorRequestModel.refresh(true);

            this.showToast(
                "Vendor request submitted successfully."
            );

            oFormModel.setData({
                vendorId: "",
                requestedItems: [
                    {
                        productId: "",
                        productName: "",
                        price: 0,
                        quantity: 1
                    }
                ]
            });

            this.getView()
                .getModel("vendorProducts")
                .setProperty("/products", []);
        }
    });
});