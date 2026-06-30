sap.ui.define([], function () {
    "use strict";

    return {
        isLocationValid: function (sRole) {
            return sRole === "Warehouse Manager";
        },

        isCompanyValid: function (sRole) {
            return sRole === "Vendor";
        },

        isSignUpEnabled: function (sName, sEmail, sPassword, sRole, sLocation, sCompany) {
            return sName && sEmail && sPassword && sRole && sLocation && sCompany;
        },

        formatDate: function (sDate) {
            if (!sDate) {
                return "";
            }

            var oDate = new Date(sDate);

            if (isNaN(oDate.getTime())) {
                return sDate;
            }

            return oDate.toLocaleDateString("en-IN", {
                year: "numeric",
                month: "long",
                day: "2-digit"
            });
        },

        formatStatus: function(sStatus) {
            console.log("Formatting status:", sStatus); // Debugging line
            switch (sStatus) {
                case "Pending":
                    return "Warning";
                case "Accepted":
                    return "Success";
                case "Rejected":
                    return "Error";
                case "Supplied":
                    return "Information";
                default:
                    return "None";
            }
        }
    }
})