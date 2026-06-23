sap.ui.define([
    "sap/ui/core/UIComponent",
    "sudeep/inventorytransfer/model/models"
], (UIComponent, models) => {
    "use strict";

    return UIComponent.extend("sudeep.inventorytransfer.Component", {
        metadata: {
            manifest: "json",
            interfaces: [
                "sap.ui.core.IAsyncContentCreation"
            ]
        },

        init() {
            // call the base component's init function
            UIComponent.prototype.init.apply(this, arguments);

            // set the device model
            this.setModel(models.createDeviceModel(), "device");

            // set the user model
            this.setModel(models.createLoginModel(), "login");
            this.setModel(models.createUserModel(), "users");
            this.setModel(models.createSignupModel(), "signup");
            this.setModel(models.createTicketModel(), "tickets");
            this.setModel(models.createSupplyModel(), "supply");
            this.setModel(models.createWarehouseProductsModel(), "warehouse");  
            this.setModel(models.createWarehouseModel(), "warehouseProfile");  
            this.setModel(models.createProductsModel(), "products");
            this.setModel(models.createAddProductsModel(), "addProducts");

            // enable routing
            this.getRouter().initialize();
        }
    });
});