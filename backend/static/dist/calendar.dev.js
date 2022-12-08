"use strict";

$(document).ready(function () {
  $(function () {
    var date = new Date();
    $('input[name="daterange"]').daterangepicker({
      "startDate": "01/01/2021",
      "endDate": "".concat(date.getDate(), "/").concat(date.getMonth() + 1, "/").concat(date.getFullYear()),
      opens: 'center',
      locale: {
        format: 'DD/MM/YYYY'
      }
    });
  });
});