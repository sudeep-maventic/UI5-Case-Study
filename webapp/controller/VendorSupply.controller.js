sap.ui.define([
    "sudeep/inventorytransfer/controller/BaseController",
    "sap/ui/model/json/JSONModel",
    "sap/m/MessageBox",
    "sap/m/MessageToast",
    "sap/m/Dialog",
    "sap/m/TextArea",
    "sap/m/Button",
    "sap/m/Label",
    "sap/ui/core/Fragment"
], (BaseController, JSONModel, MessageBox, MessageToast, Dialog, TextArea, Button, Label, Fragment) => {
    "use strict";

    return BaseController.extend("sudeep.inventorytransfer.controller.VendorSupply", {
        onInit() {
            this.getRouter().getRoute("RouteVendorSupply").attachPatternMatched(this._onRouteMatched, this);

        },

        _onRouteMatched: function(oEvent) {

            const sRequestId = oEvent.getParameter("arguments").requestId;
            const aRequests = this.getOwnerComponent().getModel("vendorRequests").getProperty("/vendorRequests") || [];
            const oRequest = aRequests.find(request => request.requestId === sRequestId);

            if(!oRequest){
                this.error(`Request with ID ${sRequestId} not found.`);
                return;
            }

            oRequest.requestedItems.forEach(item => {
                if(!item.supplyQuantity) {
                    item.supplyQuantity = item.quantity;
                }
            });

            this.getView().setModel(new JSONModel(oRequest), "supply");
            console.log(this.getView().getModel("supply").getData());
        },

        onNavBack: function () {
            this.getRouter().navTo("RouteWarehouseRequests");
        },

        onAcceptRequest: function () {
            const oSupplyModel = this.getView().getModel("supply");
            const oSupply = oSupplyModel.getData();

            const sRequestId = oSupplyModel.getProperty("/requestId");
            const aRequests = this.getOwnerComponent().getModel("vendorRequests").getProperty("/vendorRequests") || [];
            const oRequest = aRequests.find(request => request.requestId === sRequestId);

            for(let i=0; i < oSupply.requestedItems.length; i++) {
                const oItem = oSupply.requestedItems[i];

                if(oItem.supplyQuantity <= 0 ) {
                    MessageToast.show("Invalid supply quantity for item: " + oItem.productName);
                    return;
                }
                if(oItem.price <= 0) {
                    MessageToast.show("Invalid price for item: " + oItem.productName);
                    return;
                }
            }

            if(oRequest) {
                oRequest.status = "Accepted";
            }
            this.getOwnerComponent().getModel("vendorRequests").refresh(true);
            this.showToast("Request accepted successfully.");
            this.getRouter().navTo("RouteWarehouseRequests");
        },

        onRejectRequest: async function() {

            if (!this._oRejectDialog) {
                this._oRejectDialog = await this.loadFragment({
                name: "sudeep.inventorytransfer.fragments.RejectRequest"});
            }

            this._oRejectDialog.open();
        },

        onConfirmReject: function () {
            const sReason = this.byId("txtReason").getValue().trim();

            if (!sReason) {
                this.showToast("Please enter a reason.");
                return;
            }

            const oSupply = this.getView().getModel("supply");
            const sRequestId = oSupply.getProperty("/requestId");

            const aRequests = this.getOwnerComponent().getModel("vendorRequests").getProperty("/vendorRequests");
            const oRequest = aRequests.find(r => r.requestId === sRequestId);

            if (oRequest) {
                oRequest.status = "Rejected";
                oRequest.rejectionReason = sReason;
            }
            this.getOwnerComponent().getModel("vendorRequests").refresh(true);
            this.byId("txtReason").setValue("");
            this._oRejectDialog.close();
            this.showToast("Request rejected successfully.");
            this.getRouter().navTo("RouteWarehouseRequests");
        },

        onCloseRejectDialog: function () {
            this.byId("txtReason").setValue("");
            this._oRejectDialog.close();
        },

        onSupplyProducts: function() {
            const oSupply = this.getView().getModel("supply").getData();

            if(oSupply.status !== "Accepted") {
                MessageToast.show("Request must be accepted before supplying products.");
                return;
            }

            const aProducts = this.getOwnerComponent().getModel("products").getProperty("/products") || [];

            for(let i=0; i < oSupply.requestedItems.length; i++) {
                const oItem = oSupply.requestedItems[i];

                if(oItem.supplyQuantity <= 0 ) {
                    MessageToast.show("Invalid supply quantity for item: " + oItem.productName);
                    return;
                }
                if(oItem.price <= 0) {
                    MessageToast.show("Invalid price for item: " + oItem.productName);
                    return;
                }
            }

            //Update the products in the warehouse inventory
            oSupply.requestedItems.forEach(item => {

                const oExistingProduct = aProducts.find(product => product.productName.toLowerCase() === item.productName.toLowerCase() && product.warehouseId === oSupply.warehouseId);
                
                if(oExistingProduct) {
                    oExistingProduct.quantity += item.supplyQuantity;
                    oExistingProduct.price = item.price;
                    oExistingProduct.status = oExistingProduct.quantity < 10 ? "Low Stock" : "Available";
                }
                else {
                    // If the product doesn't exist in the warehouse, add it
                    aProducts.push({
                        productId: "P" + String(aProducts.length + 1).padStart(3, "0"),
                        productName: item.productName,
                        category: item.category,
                        quantity: item.supplyQuantity,
                        price: item.price,
                        status: item.supplyQuantity < 10 ? "Low Stock" : "Available",
                        warehouseId: oSupply.warehouseId,
                        vendorId: this.getCurrentUser().vendorId
                    });
                }
            });

            this.getOwnerComponent().getModel("products").refresh(true);

            // Vendor Request Update 
            const aRequests = this.getOwnerComponent().getModel("vendorRequests").getProperty("/vendorRequests") || [];
            const oRequest = aRequests.find(request => request.requestId === oSupply.requestId);

            if(oRequest) {
                oRequest.status = "Supplied";
            }
            this.getOwnerComponent().getModel("vendorRequests").refresh(true);
            this._saveNotification(oSupply);
            this.showToast("Products supplied successfully.");
            this._resetSupplyModel();
            this.getRouter().navTo("RouteWarehouseRequests");
        },

        _saveNotification: function(oSupply) {
            // Notification 
            const oNotification = this.getOwnerComponent().getModel("notifications").getProperty("/notifications") || [];
            oNotification.push({
                notificationId: "N" + String(oNotification.length + 1).padStart(3, "0"),
                userId: oSupply.warehouseId,
                role: "Warehouse Manager",
                title: "Products Supplied",
                message: "Vendor has supplied products for request: " + oSupply.requestId,
                read: false,
                type: "Success",
                timestamp: new Date().toLocaleString()
            });
            this.getOwnerComponent().getModel("notifications").refresh(true);
        },

        _resetSupplyModel: function() {
            this.getView().setModel(new JSONModel({
                requestId: "",
                warehouseId: "",
                vendorId: "",
                status: "",
                reason: "",
                requestDate: "",
                requestedItems: []
            }), "supply");
        },

        onPriceChange: function (oEvent) {
        const oInput = oEvent.getSource();
        const sValue = oInput.getValue();

        // Allow only positive decimal numbers
        const bValid = '/^\d+(\.\d+)?$/.test(sValue) && parseFloat(sValue) > 0';

        if (!bValid && sValue !== "") {
            oInput.setValueState("Error");
            oInput.setValueStateText("Enter a value greater than 0");
        } else {
            oInput.setValueState("None");
        }
        }
    });
});