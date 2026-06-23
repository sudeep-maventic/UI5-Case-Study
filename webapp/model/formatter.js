sap.ui.define([], function() {
    "use strict";

    return {
        isLocationValid: function(sRole) {
            return sRole === "Warehouse Manager";
        },

        isCompanyValid: function(sRole) {
            return sRole === "Vendor";
        },

        isSignUpEnabled: function(sName, sEmail, sPassword, sRole, sLocation, sCompany) {
            return sName && sEmail && sPassword && sRole && sLocation && sCompany;
        }
    }
})