sap.ui.define([
    "sudeep/inventorytransfer/controller/BaseController",
], function (BaseController) {
    "use strict";

    return BaseController.extend("sudeep.inventorytransfer.controller.TransferProducts", {
        onInit: function() {
            let oCurrentUser = this.getCurrentUser();

            let oTransferModel = this.getOwnerComponent().getModel("transferForm");
            this.getView().setModel(oTransferModel, "transferForm");

            const oWarehouseModel = this.getOwnerComponent().getModel("warehouseProfile");
            let aWarehouses = oWarehouseModel.getProperty("/warehouses");

            // Add "Select Location" only once
            if (aWarehouses.length === 0 || aWarehouses[0].warehouseId !== "") {
                aWarehouses.unshift({
                warehouseId: "",
                location: "Select Destination Warehouse"
                });

                oWarehouseModel.setProperty("/warehouses", aWarehouses);
            }

            const aProducts = this.getOwnerComponent().getModel("products").getProperty("/products");
            const aWarehouseProducts = aProducts.filter(product => product.warehouseId === oCurrentUser.warehouseId);

            aWarehouseProducts.unshift({
                productId: "",
                productName: "Select Inventory Product",
            })

            this.getView().setModel(new sap.ui.model.json.JSONModel({products: aWarehouseProducts}), "warehouseProducts");

            this.getView().getModel("transferForm").setProperty("/fromWarehouse", oCurrentUser.warehouseId);
            
        }, 

        onAddItem: function() {
            const oTransferModel = this.getView().getModel("transferForm");
            const aItems = oTransferModel.getProperty("/items") || [];

            aItems.push({
                productId: "",
                productName: "",
                quantity: 0
            })

            oTransferModel.setProperty("/items", aItems);
        },

        onRemoveItem: function(oEvent) {
            const sPath = oEvent.getSource().getBindingContext("transferForm").getPath();
            const iIndex = parseInt(sPath.split("/")[2]);

            const oTransferModel = this.getView().getModel("transferForm");

            const aItems = this.getView().getModel("transferForm").getProperty("/items");
            aItems.splice(iIndex, 1);

            oTransferModel.setProperty("/items", aItems);

            this.getView().getModel("transferForm").refresh(true);
        },

        onProductChange: function(oEvent) {
            const sSelectedProduct = oEvent.getSource().getSelectedKey();
            const sCurrentPath = oEvent.getSource().getBindingContext("transferForm").getPath();
            const aItems = this.getView().getModel("transferForm").getProperty("/items");

            const bDuplicate = aItems.some((item, index) => {
                return "/items/" + index !== sCurrentPath &&
                    item.productId === sSelectedProduct;
            });

            if (bDuplicate) {
                this.showError("This product has already been selected.");
                oEvent.getSource().setSelectedKey("");
                return;
            }
        },

        onSubmitTransfer: function() {
            const oTransfer = this.getView().getModel("transferForm").getData();

            if(!oTransfer.toWarehouse){
                this.showToast("Please select a destination warehouse.");
                return;
            }

            if(oTransfer.fromWarehouse === oTransfer.toWarehouse) {
                this.showToast("From and To Warehouse cannot be the same.");
                return;
            }

            if(oTransfer.items.length === 0) {
                this.showError("Please add at least one item to transfer.");
                return;
            }

            const aProducts = this.getOwnerComponent().getModel("products").getProperty("/products");
            const aTransferItems = [];

            for(let items of oTransfer.items) {
                const oProduct = aProducts.find(product => product.productId === items.productId);

                if(!oProduct) {
                    this.showError(`Product with ID ${items.productId} not found.`);
                    return;
                }

                if(items.quantity <= 0) {
                    this.showError(`Quantity for product ${oProduct.productName} must be greater than zero.`);
                    return;
                }

                if(items.quantity > oProduct.quantity) {
                    this.showError(`Not enough quantity for product ${oProduct.productName}. Available: ${oProduct.quantity}, Requested: ${items.quantity}`);
                    return;
                }

                aTransferItems.push({
                    productId: oProduct.productId,
                    productName: oProduct.productName,
                    quantity: items.quantity
                });

                oProduct.quantity -= items.quantity;
                oProduct.status = oProduct.quantity > 0 ? "Available" : "Out of Stock";
            }

            // Update products model 
            this.getOwnerComponent().getModel("products").setProperty("/products", aProducts);

            this.getOwnerComponent().getModel("products").refresh(true);


            const oTransferHistoryModel = this.getOwnerComponent().getModel("transferHistory");
            const aTransfers = oTransferHistoryModel.getProperty("/transfers") || [];
            aTransfers.push({
                transferId: "T" + (aTransfers.length + 1).toString().padStart(3, '0'),
                fromWarehouse: oTransfer.fromWarehouse,
                toWarehouse: oTransfer.toWarehouse,
                items: aTransferItems,
                transferDate: new Date().toISOString(),
                status: "Pending"
            });

            oTransferHistoryModel.setProperty("/transfers", aTransfers);
            oTransferHistoryModel.refresh(true);

            console.log("saved Transfers: ", oTransferHistoryModel.getProperty("/transfers"));
            this.showToast("Transfer submitted successfully.");
            this.getView().getModel("transferForm").setData({
                fromWarehouse: oTransfer.fromWarehouse,
                toWarehouse: "",
                items: [
                    {
                        productId: "",
                        productName: "",
                        quantity: 0
                    }
                ]
            })

        }
    })
})