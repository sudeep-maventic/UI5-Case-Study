sap.ui.define([
    "sudeep/inventorytransfer/controller/BaseController",
    "sap/ui/model/json/JSONModel",
    "sap/m/MessageToast",
    "sap/m/MessageBox"
], function (BaseController, JSONModel, MessageToast, MessageBox) {

    "use strict";

    return BaseController.extend(
        "sudeep.inventorytransfer.controller.VendorRequests",
        {

            onInit: function () {
                // // let oCurrentUser = this.getCurrentUser();
                // this.getView().setModel(new JSONModel({
                //         products: []
                //     }),
                //     "vendorProducts"
                // );

                this.getView().setModel(this.getOwnerComponent().getModel("vendorRequestsForm"),"RequestsForm");
                const aVendors = this.getOwnerComponent().getModel("vendors").getProperty("/vendors") || [];
                this.getView().setModel(new JSONModel({ vendors: aVendors }), "vendorList");
            },

            onVendorChange: function (oEvent) {

                const sVendorId = oEvent.getSource().getSelectedKey();

                const aVendors = this.getView().getModel("vendorList").getProperty("/vendors");
                const oVendor = aVendors.find(v => v.vendorId === sVendorId);

                const oRequestModel = this.getView().getModel("RequestsForm");
                oRequestModel.setProperty("/vendorId", sVendorId);
                oRequestModel.setProperty("/company", oVendor.company);
            },

            onAddItem: function () {

                const oModel = this.getView().getModel("RequestsForm");
                const aItems = oModel.getProperty("/requestedItems") || [];
    //             let iNext = 1;

    //             if (aItems.length > 0) {
    //                  const iMax = Math.max(
    //                  ...aItems.map(item =>
    //                  parseInt((item.productId || "P000").replace("P", ""), 10)
    //                  )
    //              );
    //              iNext = iMax + 1;
    //              }

                const sProductId = "P" + String(aItems.length + 1).padStart(3, "0");

                aItems.push({
                    productId: sProductId,
                    productName: "",
                    category: "",
                    quantity: 1,
                    price: 0
                });

                oModel.setProperty("/requestedItems", aItems);
            },

            onRemoveItem: function (oEvent) {

                const sPath = oEvent.getSource().getBindingContext("RequestsForm").getPath();
                const iIndex = Number(sPath.split("/")[2]);

                const oFormModel = this.getView().getModel("RequestsForm");
                const aItems = oFormModel.getProperty("/requestedItems");

                aItems.splice(iIndex, 1);
                oFormModel.setProperty("/requestedItems", aItems);
            },

            onSubmitRequest: function () {

                const oRequestModel = this.getView().getModel("RequestsForm");
                const oRequest = oRequestModel.getData();
                if (!oRequest.vendorId) {
                    this.showError("Please select a vendor.");
                    return;
                }
                if (!oRequest.requestedItems.length) {
                    this.showError("Please add at least one product.");
                    return;
                }

                for (let item of oRequest.requestedItems) {
                    if(!item.productName.trim()){
                        this.showError("Please enter a Product Name");
                        return;
                    }

                    if(item.quantity <= 0){
                        this.showError("Quantity must be greater than 0 for product: " + item.productName);
                        return;
                    }
                }

                const bDuplicate = new Set(oRequest.requestedItems.map(item => item.productName.trim().toLowerCase())).size !== oRequest.requestedItems.length;
                if (bDuplicate) {
                    this.showError("Duplicate products found in the request.");
                    return;
                }

                const oVendorRequestModel = this.getOwnerComponent().getModel("vendorRequests");
                const aRequests = oVendorRequestModel.getProperty("/vendorRequests") || [];

                const oCurrentUser = this.getCurrentUser();

                aRequests.push({
                    requestId: "VR" + String(aRequests.length + 1).padStart(3, "0"),
                    warehouseId: oCurrentUser.warehouseId,
                    vendorId: oRequest.vendorId,
                    status: "Pending",
                    reason: oRequest.reason,
                    requestDate: new Date().toISOString(),
                    requestedItems: oRequest.requestedItems
                });

                oVendorRequestModel.setProperty("/vendorRequests", aRequests);
                oVendorRequestModel.refresh(true);

                this.showToast("Purchase Request Submitted Successfully");

                oRequestModel.setData({
                    vendorId: "",
                    reason: "",
                    requestedItems: []
                });

                oRequestModel.refresh(true);
           }
        }
    );
});