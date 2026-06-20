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

            // enable routing
            this.getRouter().initialize();
        }
    });
});