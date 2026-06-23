sap.ui.define([
    "sap/ui/core/mvc/Controller"
], function (Controller) {
    "use strict";

    return Controller.extend("sudeep.inventorytransfer.controller.Profile", {
        onInit: function () {
            const oRouter = sap.ui.core.UIComponent.getRouterFor(this);
            oRouter.getRoute("profile").attachPatternMatched(this._onRouteMatched, this);
        },

        _onRouteMatched: function (oEvent) {
            const sWarehouseId = oEvent.getParameter("arguments").warehouseId;
            this.getView().bindElement({
                path: "/profile/" + sWarehouseId
            });
        }
    });
});