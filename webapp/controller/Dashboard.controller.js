sap.ui.define([
    "sudeep/inventorytransfer/controller/BaseController",
    "sap/m/MessageToast",
    "sap/m/MessageBox",
    "sap/ui/model/json/JSONModel",
], (BaseController, MessageToast, MessageBox, JSONModel) => {
    "use strict";

    return BaseController.extend("sudeep.inventorytransfer.controller.Dashboard", {
        onInit: function() {
            this._onRouteMatched();          
        },

        _onRouteMatched: function() {
            console.log("RouteDashboard matched");
            const oCurrentUser = JSON.parse(localStorage.getItem("currentUser"));

            const oProductsModel = this.getOwnerComponent().getModel("products").getProperty("/products") || [];
            const aProducts = oProductsModel.filter(product => product.warehouseId === oCurrentUser.warehouseId);
            console.log("Products", aProducts);

            const oVendorRequestsModel = this.getOwnerComponent().getModel("vendorRequests").getProperty("/vendorRequests") || [];
            const aVendorRequests = oVendorRequestsModel.filter(request => request.warehouseId === oCurrentUser.warehouseId);
            console.log("Vendor Requests", aVendorRequests);

            const oTransfersModel = this.getOwnerComponent().getModel("transferHistory").getProperty("/transfers") || [];
            const aTransfers = oTransfersModel.filter(transfer => transfer.fromWarehouse === oCurrentUser.warehouseId);
            console.log("Transfers", aTransfers);

            const iTotalProducts = aProducts.length;
            const iLowStock = aProducts.filter(product => product.quantity < 50).length;
            const completedTransfers = aTransfers.filter(r => r.status === "Completed").length;
            const pendingRequests = aVendorRequests.filter(r => r.status === "Pending").length;

            const oCategory = {};
            aProducts.forEach(product => {
                if (oCategory[product.category]) {
                    oCategory[product.category]++;
                } else {
                    oCategory[product.category] = 1;
                }
            });

            const aCategory = Object.keys(oCategory).map(category => ({
                category: category,
                count: oCategory[category]
            }));

            // Prepare the dashboard model
            const aMonths = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
            const oMonthlyCount = {};
            aMonths.forEach(month => {
                oMonthlyCount[month] = 0;
            });

            aTransfers.forEach(transfer => {
                const transferDate = new Date(transfer.transferDate);
                if(!isNaN(transferDate)){
                    const month = aMonths[transferDate.getMonth()];
                    oMonthlyCount[month]++;
                }
            });

            const aMonthlyTransfers = aMonths.map(month => ({
                month: month,
                count: oMonthlyCount[month]
            }));

            console.log("Monthly Transfers", aMonthlyTransfers);

            const oDashboardModel = {
                managerName: oCurrentUser.name,
                totalProducts: iTotalProducts,
                completedTransfers: completedTransfers,
                pendingTransfers: pendingRequests,
                lowStock: iLowStock,
                categories: aCategory,
                monthlyTrend: aMonthlyTransfers
            }

            this.getView().setModel(new JSONModel(oDashboardModel), "dashboard");
        },

        onAfterRendering: function() {
            const oVizFrame = this.byId("idCategoryChart");
            oVizFrame.setVizProperties({
                title: { visible: false },
                legend: { visible: false },
                plotArea: {
                    dataLabel: {
                        visible: true
                    }
                },
                valueAxis: {
                    title: {
                        visible: true,
                        Text: "Number of Products"
                    }
                },
                categoryAxis: {
                    title: {
                        visible: true,
                        text: "Category"
                    }
                }
            });

            const oChart = this.byId("monthlyTransferChart");
            if(oChart) {
                oChart.setVizProperties({
                    title: {visible: false},
                    legend: {visible: false},
                    plotArea: {
                        dataLabel: {visible: true}
                    },
                    valueAxis: {
                        title: {visible: true, text: "Transfers"}
                    },
                    categoryAxis: {
                        title: {visible: true, text: "Month"}
                    }
                })
            }
        }
    })
})