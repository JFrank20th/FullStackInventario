"use strict";
$(document).ready(function () {
    var a = $(document);
    toastr.options = {
        timeOut: 3000,
        progressBar: true,
        showMethod: "slideDown",
        hideMethod: "slideUp",
        showDuration: 200,
        hideDuration: 200
    };

    a.on("click", ".toastr-examples a.btn-success", function () {
        toastr.success("Successfully completed");
        return false
    });
    
    a.on("click", ".toastr-examples a.btn-danger", function () { toastr.error("Something went wrong"); return false }); a.on("click", ".toastr-examples a.btn-info", function () { toastr.info("This is an informational message"); return false }); a.on("click", ".toastr-examples a.btn-warning", function () { toastr.warning("You are currently not authorized"); return false })
});