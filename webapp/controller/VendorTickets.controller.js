sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/m/MessageToast",
    "sap/m/MessageBox",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator"
], (Controller, MessageToast, MessageBox, Filter, FilterOperator) => {
    "use strict";

    return Controller.extend("sudeep.inventorytransfer.controller.VendorTickets", {
        onInit() {
        },

        onNavBack: function () {
            this.getOwnerComponent().getRouter().navTo("RouteVendor");
        },

        onSearch: function (oEvent) {
            let sValue = oEvent.getParameter("newValue");
            let oList = this.byId("ticketList");

            let oBinding = oList.getBinding("items");
            let aFilters = [];

            if (sValue) {
                aFilters.push(
                    new Filter({
                        filters: [
                            new Filter("ticketId", FilterOperator.EQ, Number(sValue)),
                            new Filter("location", FilterOperator.Contains, sValue)
                        ],
                        and: false
                    })
                );                
            }

            oBinding.filter(aFilters);
        },

        // onApprove: function (oEvent) {
        //     let oButton = oEvent.getSource();
        //     let oContext = oButton.getBindingContext("tickets");
        //     let sTicketId = oContext.getProperty("ticketId");

        //     MessageBox.confirm(`Are you sure you want to approve ticket ${sTicketId}?`, {
        //         title: "Confirm Approval",
        //         onClose: (oAction) => {
        //             if (oAction === MessageBox.Action.OK) {
        //                 // Update the status of the ticket to "Approved"
        //                 oContext.setProperty("status", "Approved");
        //                 MessageToast.show(`Ticket ${sTicketId} approved successfully.`);
        //             }
        //         }
        //     });
        // },

        // onReject: function (oEvent) {
        //     let oButton = oEvent.getSource();
        //     let oContext = oButton.getBindingContext("tickets");
        //     let sTicketId = oContext.getProperty("ticketId");

        //     MessageBox.confirm(`Are you sure you want to reject ticket ${sTicketId}?`, {
        //         title: "Confirm Rejection",
        //         onClose: (oAction) => {
        //             if (oAction === MessageBox.Action.OK) {
        //                 // Update the status of the ticket to "Rejected"
        //                 oContext.setProperty("status", "Rejected");
        //                 MessageToast.show(`Ticket ${sTicketId} rejected successfully.`);
        //             }
        //         }
        //     });
        // },

        // onSupply: function (oEvent) {
        //     let oButton = oEvent.getSource();
        //     let oContext = oButton.getBindingContext("tickets");
        //     let sTicketId = oContext.getProperty("ticketId");

        //     this.getRouter().navTo("VendorSupply", {
        //         ticketId: sTicketId
        //     }); 
        // }

        onTicketPress: function (oEvent) {
            let oItem = oEvent.getSource();
            let oContext = oItem.getBindingContext("tickets");
            let sTicketId = oContext.getProperty("ticketId");

            this.getOwnerComponent().getRouter().navTo("RouteVendorSupply", {
                ticketId: sTicketId
            }); 
        }   
    });
});