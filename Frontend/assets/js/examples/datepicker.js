"use strict";
$(document).ready(function () {
  $('input[name="single-date-picker"]').daterangepicker({
    singleDatePicker: true,
    showDropdowns: true,
  });
  $('input[name="simple-date-range-picker"]').daterangepicker();
  $('input[name="simple-date-range-picker-callback"]').daterangepicker(
    { opens: "left" },
    function (d, b, c) {
      swal(
        "A new date selection was made",
        d.format("YYYY-MM-DD") + " to " + b.format("YYYY-MM-DD"),
        "success"
      );
    }
  );
  $('input[name="datetimes"]').daterangepicker({
    timePicker: true,
    startDate: moment().startOf("hour"),
    endDate: moment().startOf("hour").add(32, "hour"),
    locale: { format: "M/DD hh:mm A" },
  });
  var a = $('input[name="datefilter"]');
  a.daterangepicker({
    autoUpdateInput: false,
    locale: { cancelLabel: "Clear" },
  });
  a.on("apply.daterangepicker", function (b, c) {
    $(this).val(
      c.startDate.format("MM/DD/YYYY") + " - " + c.endDate.format("MM/DD/YYYY")
    );
  });
  $("input.create-event-datepicker")
    .daterangepicker({
      singleDatePicker: true,
      showDropdowns: true,
      autoUpdateInput: false,
    })
    .on("apply.daterangepicker", function (b, c) {
      $(this).val(c.startDate.format("MM/DD/YYYY"));
    });
});
