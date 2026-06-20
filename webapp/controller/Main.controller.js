sap.ui.define([
    "sap/ui/core/mvc/Controller",
], (Controller) => {

    "use strict";
    
    return Controller.extend("sudeep.inventorytransfer.controller.Main", {
        onInit() {
        },

        onItemSelect: function (oEvent) {
            const sKey = oEvent.getParameter("item").getKey();

            const oNavContainer = this.byId("mainContainer");

            switch (sKey) {
                case "key1":
                    oNavContainer.to(this.byId("dashboardFragment"));
                    break;
                case "key2":
                    oNavContainer.to(this.byId("inventoryFragment"));
                    break;
                case "key4":
                    oNavContainer.to(this._loadView("sudeep.inventorytransfer.view.Vendor", "Vendor"));
                    break;
                default:
                    sap.m.MessageToast.show("Unknown navigation item selected.");
            }
        }
    });
});