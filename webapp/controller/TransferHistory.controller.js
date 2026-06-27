sap.ui.define([
    "sudeep/inventorytransfer/controller/BaseController",
    "sap/ui/model/json/JSONModel",
    "sap/m/MessageToast",
    "sap/m/MessageBox",
    "sudeep/inventorytransfer/model/formatter",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator"
], (BaseController, JSONModel, MessageToast, MessageBox, formatter, Filter, FilterOperator) => {
    "use strict";

    return BaseController.extend("sudeep.inventorytransfer.controller.TransferHistory", {

        formatter: formatter,

        onInit: function() {
            const oCurrentUser = this.getCurrentUser();
            const sWarehouseId = oCurrentUser.warehouseId;
            const aTransfers = this.getOwnerComponent().getModel("transferHistory").getProperty("/transfers") || [];
            const aWarehouses = this.getOwnerComponent().getModel("warehouseProfile").getProperty("/warehouses") || [];

            const aHistory = [];

            aTransfers.forEach(transfer => {
                if(transfer.fromWarehouse === sWarehouseId){
                    const oSource = aWarehouses.find(warehouse => warehouse.warehouseId === transfer.fromWarehouse);
                    const oDestination = aWarehouses.find(warehouse => warehouse.warehouseId === transfer.toWarehouse);

                    aHistory.push({
                        transferId: transfer.transferId,
                        fromWarehouse: oSource.location,
                        toWarehouse: oDestination.location,
                        status: transfer.status,
                        transferDate: transfer.transferDate
                    });
                }
            });
            this.getView().setModel(new JSONModel({ transfers: aHistory }), "history");
        },

        onTransferPress: function(oEvent) {
            const oSelectedItem = oEvent.getSource().getBindingContext("history").getObject("transferId");
            this.getRouter().navTo("RouteTransferDetails", { transferId: oSelectedItem });
        },

        onSearch: function(oEvent) {
            const sValue = oEvent.getParameter("newValue");
            const oBinding = this.byId("transferList").getBinding("items");

            if(!sValue) {
                oBinding.filter([]);
                return;
            }
            const aFilters = [
                new Filter("transferId", FilterOperator.Contains, sValue),
            ];

            oBinding.filter(new Filter({
                filters: aFilters,
                and: false
            }));
        }
    });
});