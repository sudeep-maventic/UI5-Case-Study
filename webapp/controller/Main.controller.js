sap.ui.define([
    "sudeep/inventorytransfer/controller/BaseController"
], (BaseController) => {

    "use strict";

    return BaseController.extend("sudeep.inventorytransfer.controller.Main", {
        onInit() {
        },

        onItemSelect: function (oEvent) {
            const sKey = oEvent.getParameter("item").getKey();

            const oNavContainer = this.byId("mainContainer");

            switch (sKey) {
                case "dashboard":
                    oNavContainer.to(this.byId("dashboardFragment"));
                    break;
                case "products":
                    oNavContainer.to(this.byId("inventoryFragment"));
                    break;
                case "transfer":
                    oNavContainer.to(this._loadView("sudeep.inventorytransfer.view.Vendor", "Vendor"));
                    break;
                case "history":
                    oNavContainer.to(this._loadView("sudeep.inventorytransfer.view.VendorTickets", "VendorTickets"));
                    break;
                case "vendor":
                    oNavContainer.to(this._loadView("sudeep.inventorytransfer.view.VendorSupply", "VendorSupply"));
                    break;
                case "profile":
                    this.getRouter().navTo("RouteProfile");
                    break;
                default:
                    sap.m.MessageToast.show("Unknown navigation item selected.");
            }
        }
    });
});