sap.ui.define([
    "sudeep/inventorytransfer/controller/BaseController",
    "sap/ui/model/json/JSONModel"
], function(BaseController, JSONModel) {
    "use strict";

    return BaseController.extend("sudeep.inventorytransfer.controller.VendorRequests", {
        onInit: function() {
            this.getView().setModel(new JSONModel({
                products: [],
            }), "vendorProducts");
        },

        onVendorChange: function(oEvent) {
            const sVendorId = oEvent.getSource().getSelectedKey();
            const aVendors = this.getView().getModel("vendors").getProperty("/vendors");

            const oVendor = aVendors.find(vendor => vendor.id === sVendorId);
            this.getView().getModel("vendorProducts").setProperty("/products", oVendor ? oVendor.products : []);
        },

        onAddItem: function() {
            const oRequestModel = this.getView().getModel("vendorRequestsForm");
            const aItems = oRequestModel.getProperty("/items") || [];
            aItems.push({
                productId: "",
                quantity: 0
            });
            oRequestModel.setProperty("/items", aItems);
            oRequestModel.refresh();
        },

        onRemoveItem: function(oEvent) {
            const sPath = oEvent.getSource().getBindingContext("vendorRequestsForm").getPath();
            const iIndex = parseInt(sPath.split("/")[2]);
            const oRequestModel = this.getView().getModel("vendorRequestsForm");
            const aItems = oRequestModel.getProperty("/items");
            aItems.splice(iIndex, 1);
            oRequestModel.setProperty("/items", aItems);
            oRequestModel.refresh();
        },

        onSubmitRequest: function() {
            const oRequestModel = this.getView().getModel("vendorRequestsForm");
            const oRequestData = oRequestModel.getData();

            if (!oRequestData.vendorId || !oRequestData.items || oRequestData.items.length === 0) {
                this.showToast("Please fill in all required fields.");
                return;
            }

            const aVendors = this.getOwnerComponent().getModel("vendors").getProperty("/vendors");
            const oVendor = aVendors.find(vendor => vendor.id === oRequestData.vendorId);

            if (!oVendor) {
                this.showToast("Selected vendor not found.");
                return;
            }

            const aRequestItems = [];

            oRequestData.items.forEach(item => {
                const oProduct = oVendor.items.find(product => product.id === item.productId);
                if(oProduct){
                    aRequestItems.push({
                        productId: oProduct.id,
                        productName: oProduct.name,
                        price: oProduct.price,
                    });
                }
            });

            const oCurrentUser = this.getCurrentUser();

            const oVendorRequestModel = this.getOwnerComponent().getModel("vendorRequests");
            const aVendorRequests = oVendorRequestModel.getProperty("/vendorRequests") || [];

            aRequestItems.push({
                requestedId: "VR" + (aVendorRequests.length + 1).toString().padStart(4, '0'),
                warehouseId: oCurrentUser.warehouseId,
                vendorId: oRequestData.vendorId,
                status: "Pending",
                requestedItems: aRequestItems
            });

            oVendorRequestModel.setProperty("/vendorRequests", aVendorRequests);
            this.showToast("Vendor request submitted successfully.");

            this.getView().getModel("vendorRequestsForm").setData({
                vendorId: "",
                requestedItems: [
                    {
                        productId: "",
                        productName: "",
                        price: 0
                    }
                ]
            });

            this.getView().getModel("vendorProducts").setProperty("/products", []);
        }
    })
})