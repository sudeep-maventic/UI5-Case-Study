sap.ui.define([
    "sudeep/inventorytransfer/controller/BaseController",
    "sap/ui/model/json/JSONModel"
], function (BaseController, JSONModel) {

    "use strict";

    return BaseController.extend(
        "sudeep.inventorytransfer.controller.VendorRequests",
        {

            onInit: function () {

                this.getView().setModel(
                    new JSONModel({
                        products: []
                    }),
                    "vendorProducts"
                );

                this.getView().setModel(
                    this.getOwnerComponent()
                        .getModel("vendorRequestsForm"),
                    "vendorRequestsForm"
                );
            },

            onVendorChange: function (oEvent) {

                const sVendorId =
                    oEvent.getSource().getSelectedKey();

                const aVendors =
                    this.getOwnerComponent()
                        .getModel("vendors")
                        .getProperty("/vendors") || [];

                const oVendor =
                    aVendors.find(
                        v => v.vendorId === sVendorId
                    );

                this.getView()
                    .getModel("vendorProducts")
                    .setProperty(
                        "/products",
                        oVendor ? oVendor.products : []
                    );
            },

            onAddItem: function () {

                const oFormModel =
                    this.getView()
                        .getModel("vendorRequestsForm");

                const aItems =
                    oFormModel.getProperty(
                        "/requestedItems"
                    ) || [];

                aItems.push({
                    productId: "",
                    productName: "",
                    price: 0,
                    quantity: 1
                });

                oFormModel.setProperty(
                    "/requestedItems",
                    aItems
                );
            },

            onRemoveItem: function (oEvent) {

                const sPath =
                    oEvent.getSource()
                        .getBindingContext(
                            "vendorRequestsForm"
                        )
                        .getPath();

                const iIndex =
                    parseInt(
                        sPath.split("/")[2]
                    );

                const oFormModel =
                    this.getView()
                        .getModel(
                            "vendorRequestsForm"
                        );

                const aItems =
                    oFormModel.getProperty(
                        "/requestedItems"
                    );

                aItems.splice(iIndex, 1);

                oFormModel.setProperty(
                    "/requestedItems",
                    aItems
                );
            },

            onProductChange: function (oEvent) {

                const sProductId =
                    oEvent.getSource()
                        .getSelectedKey();

                const sPath =
                    oEvent.getSource()
                        .getBindingContext(
                            "vendorRequestsForm"
                        )
                        .getPath();

                const aProducts =
                    this.getView()
                        .getModel("vendorProducts")
                        .getProperty("/products");

                const oProduct =
                    aProducts.find(
                        p => p.productId === sProductId
                    );

                if (oProduct) {

                    const oFormModel =
                        this.getView()
                            .getModel(
                                "vendorRequestsForm"
                            );

                    oFormModel.setProperty(
                        sPath + "/productName",
                        oProduct.productName
                    );

                    oFormModel.setProperty(
                        sPath + "/price",
                        oProduct.price
                    );
                }
            },

            onSubmitRequest: function () {

                const oFormModel =
                    this.getView()
                        .getModel(
                            "vendorRequestsForm"
                        );

                const oRequest =
                    oFormModel.getData();

                if (!oRequest.vendorId) {

                    this.showError(
                        "Please select a vendor."
                    );

                    return;
                }

                if (
                    !oRequest.requestedItems.length
                ) {

                    this.showError(
                        "Please add at least one product."
                    );

                    return;
                }

                const oVendorRequestModel =
                    this.getOwnerComponent()
                        .getModel(
                            "vendorRequests"
                        );

                const aRequests =
                    oVendorRequestModel.getProperty(
                        "/vendorRequests"
                    ) || [];

                const oCurrentUser =
                    this.getCurrentUser();

                aRequests.push({

                    requestId:
                        "VR" +
                        String(
                            aRequests.length + 1
                        ).padStart(3, "0"),

                    warehouseId:
                        oCurrentUser.warehouseId,

                    vendorId:
                        oRequest.vendorId,

                    status: "Pending",

                    requestDate:
                        new Date()
                            .toISOString(),

                    requestedItems:
                        oRequest.requestedItems
                });

                oVendorRequestModel.setProperty(
                    "/vendorRequests",
                    aRequests
                );

                oVendorRequestModel.refresh(true);

                this.showToast(
                    "Vendor Request Submitted Successfully"
                );

                oFormModel.setData({

                    vendorId: "",

                    requestedItems: [{
                        productId: "",
                        productName: "",
                        price: 0,
                        quantity: 1
                    }]
                });

                this.getView()
                    .getModel(
                        "vendorProducts"
                    )
                    .setProperty(
                        "/products",
                        []
                    );
            }
        }
    );
});