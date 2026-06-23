sap.ui.define([
    "sudeep/inventorytransfer/controller/BaseController",
    "sap/m/MessageToast",
    "sap/m/MessageBox",
    "sap/ui/model/json/JSONModel",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator"
], function (BaseController, MessageToast, MessageBox, JSONModel, Filter, FilterOperator){

    "use strict";

    return BaseController.extend("sudeep.inventorytransfer.controller.InventoryProducts", {
        onInit: function() {
            const oCurrentUser = this.getCurrentUser();
            const sWarehouseId = oCurrentUser.warehouseId;

            const oProductsModel = this.getOwnerComponent().getModel("products");
            const aProducts = oProductsModel.getData().products;

            const aFilteredProducts = aProducts.filter(product => product.warehouseId === sWarehouseId);

            this.getView().setModel(new JSONModel({products: aFilteredProducts}), "inventory");

            const oAddProductsModel = this.getOwnerComponent().getModel("addProducts");
            this.getView().setModel(oAddProductsModel, "addProduct");

        },

        onSearch: function(oEvent) {
            const sQuery = oEvent.getParameter("newValue");

            const oTable = this.getView().byId("productsTable");
            const oBinding = oTable.getBinding("items");

            if(sQuery) {
                const oFilter = new Filter("productName", FilterOperator.Contains, sQuery);
                oBinding.filter(oFilter);
            }
            else{
                oBinding.filter([]);
            }
        },

        onAddProductPress: function() {
            if(!this._oAddProductDialog) {
                this._oAddProductDialog = sap.ui.xmlfragment("sudeep.inventorytransfer.fragments.AddProduct", this);
                this.getView().addDependent(this._oAddProductDialog);
            }
            this._oAddProductDialog.open();            
        },

        onSaveProduct: function() {

    const oAddProductModel =
        this.getView()
            .getModel("addProduct");

    const oNewProduct =
        oAddProductModel.getData();

    if (

        !oNewProduct.productName ||

        !oNewProduct.category ||

        oNewProduct.price <= 0

    ) {

        this.showError(
            "Please fill all required fields"
        );

        return;
    }

    const oCurrentUser =
        this.getCurrentUser();

    const oProductsModel =
        this.getOwnerComponent()
            .getModel("products");

    const aProducts =
        oProductsModel.getData()
            .products || [];

    // EDIT LOGIC

    if (this._sEditProductId) {

        const oProduct =
            aProducts.find(

                product =>

                    product.productId ===

                    this._sEditProductId

            );

        if (oProduct) {

            oProduct.productName =
                oNewProduct.productName;

            oProduct.category =
                oNewProduct.category;

            oProduct.quantity =
                Number(
                    oNewProduct.quantity
                );

            oProduct.price =
                Number(
                    oNewProduct.price
                );

            oProduct.status =

                Number(
                    oNewProduct.quantity
                ) < 10

                    ?

                    "Low Stock"

                    :

                    "Available";

        }

        oProductsModel.refresh(true);

        const aFilteredProducts =
            aProducts.filter(

                product =>

                    product.warehouseId ===

                    oCurrentUser.warehouseId

            );

        this.getView()

            .getModel("inventory")

            .setData({

                products:
                    aFilteredProducts

            });

        this.showToast(
            "Product Updated Successfully"
        );

        this._sEditProductId = null;

    }

    // ADD LOGIC

    else {

        const sProductId =

            "P" +

            Date.now();

        aProducts.push({

            productId:
                sProductId,

            productName:
                oNewProduct.productName,

            category:
                oNewProduct.category,

            quantity:
                Number(
                    oNewProduct.quantity
                ),

            price:
                Number(
                    oNewProduct.price
                ),

            warehouseId:
                oCurrentUser.warehouseId,

            status:

                Number(
                    oNewProduct.quantity
                ) < 10

                    ?

                    "Low Stock"

                    :

                    "Available"

        });

        oProductsModel.setData({

            products:
                aProducts

        });

        const aFilteredProducts =
            aProducts.filter(

                product =>

                    product.warehouseId ===

                    oCurrentUser.warehouseId

            );

        this.getView()

            .getModel("inventory")

            .setData({

                products:
                    aFilteredProducts

            });

        this.showToast(
            "Product Added Successfully"
        );

    }

    oProductsModel.refresh(true);

    this._oAddProductDialog.close();

    oAddProductModel.setData({

        productName: "",

        category: "",

        quantity: 0,

        price: 0

    });

},

        onCloseDialog: function() {
            this._oAddProductDialog.close();
        },

        onEditProductPress: function(oEvent) {
            
            const oSelectedProduct = oEvent.getSource().getBindingContext("inventory").getObject();
            this._sEditProductId = oSelectedProduct.productId;

            this.getView().getModel("addProduct").setData({
                productName: oSelectedProduct.productName,
                category: oSelectedProduct.category,
                quantity: oSelectedProduct.quantity,
                price: oSelectedProduct.price
            });

            if(!this._oAddProductDialog) {
                this._oAddProductDialog = sap.ui.xmlfragment("sudeep.inventorytransfer.fragments.AddProduct", this);
                this.getView().addDependent(this._oAddProductDialog);
            }

            this._oAddProductDialog.setTitle("Edit Product");
            this._oAddProductDialog.open();
            
        },

        onDeleteProducts: function(oEvent) {

            const oSelectedItem = oEvent.getSource().getBindingContext("inventory").getObject();

            sap.m.MessageBox.confirm("Are you sure you want to delete this product?", {
                title: "Confirm Deletion", 
                onclose: function(oAction) {
                    if (oAction === sap.m.MessageBox.oAction.OK) {
                        const oProductsModel = this.getOwnerComponent().getModel("products");
                        let aProducts = oProductsModel.getData().products;

                        aProducts = aProducts.filter(product => product.productId !== oSelectedItem.productId);
                        oProductsModel.setData({products: aProducts});
                        oProductsModel.refresh();

                        const oCurrentUser = this.getCurrentUser();
                        const aFilteredProducts = aProducts.filter(
                            product => product.warehouseId === oCurrentUser.warehouseId
                        );

                        this.getView().getModel("inventory").setData({products: aFilteredProducts});

                        this.showToast("Product deleted successfully");
                    }
                }.bind(this)
            });

            
        },

       onTransferProducts: function(oEvent) {
            this.getRouter().navTo("RouteTransferProducts");
       }    
    })
})