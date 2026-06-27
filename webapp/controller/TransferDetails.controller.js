sap.ui.define([
    "sudeep/inventorytransfer/controller/BaseController",
    "sap/ui/model/json/JSONModel",
    "sap/m/MessageToast",
    "sap/m/MessageBox",
    "sudeep/inventorytransfer/model/formatter"
], (BaseController, JSONModel, MessageToast, MessageBox, formatter) => {
    "use strict";

    return BaseController.extend("sudeep.inventorytransfer.controller.TransferDetails", {
        
        formatter: formatter,

        onInit: function() {
            this.getRouter().getRoute("RouteTransferDetails").attachPatternMatched(this._onRouteMatched, this);
        },

        _onRouteMatched: function(oEvent) {
            const sTransferId = oEvent.getParameter("arguments").transferId;
            const aTransfers = this.getOwnerComponent().getModel("transferHistory").getProperty("/transfers") || [];
            const aWarehouses = this.getOwnerComponent().getModel("warehouseProfile").getProperty("/warehouses") || [];

            const oTransfer = aTransfers.find(transfer => transfer.transferId === sTransferId);

            if(oTransfer){
                const oSource = aWarehouses.find(warehouse => warehouse.warehouseId === oTransfer.fromWarehouse);
                const oDestination = aWarehouses.find(warehouse => warehouse.warehouseId === oTransfer.toWarehouse);

                const oTransferDetails = {
                    transferId: oTransfer.transferId,
                    sourceWarehouse: oSource.warehouseName,
                    destinationWarehouse: oDestination.warehouseName,
                    fromWarehouse: oSource.location,
                    toWarehouse: oDestination.location,
                    status: oTransfer.status,
                    transferDate: oTransfer.transferDate,
                    items: oTransfer.items
                };

                this.getView().setModel(new JSONModel(oTransferDetails), "transferDetails");
            }
        
        },

        onNavBack: function () {
            const oRouter = this.getOwnerComponent().getRouter();
            oRouter.navTo("RouteInventory");
        }

    });
});