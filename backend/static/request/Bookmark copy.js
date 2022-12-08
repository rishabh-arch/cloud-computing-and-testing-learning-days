
$(document).ready(() => {

  $('.BM-btn').click(function () {
    var value = $(this).attr("value");
    $(`#${value}`).toggleClass("active");

    setTimeout(function () {
      $(`#${value}`).removeClass("active");
    }, 1000);
    var formData = {
      'PID': $(this).attr('value')
    };
    console.log(formData);
    $.ajax({
      type: 'post',
      url: '/product/user/bookmark',
      timeout: 2000,
      data: formData,
      dataType: 'json',
      // cache: false

      // encode: true
      success: (data) => {
        console.log(data)
        $(`#${value}`).text(data.add);
        //reset form

      }
    })
      .done(function (data) {
        console.log(data);
        return ("done");
      })
  });
  // var x = f();
  var quantitiy = 0;
  $('.quantity-right-plus').click(function (e) {
    // Stop acting like a button
    e.preventDefault();
    // Get the field name
    var quantity = parseInt($('#quantity').val());
    var total_price = parseInt(document.getElementById("unit-price-js").innerHTML);
    // If is not undefined
    total = total_price * (quantity + 1);
    document.getElementById("total-price-js").innerHTML = total;
    $('#quantity').val(quantity + 1);



    // Increment

  });

  $('.quantity-left-minus').click(function (e) {
    // Stop acting like a button

    e.preventDefault();
    var quantity = parseInt($('#quantity').val());
    var total_price = parseInt(document.getElementById("unit-price-js").innerHTML);

    // If is not undefined

    // Increment

    if (quantity > 0) {
      $('#quantity').val(quantity - 1);
      total = total_price * (quantity - 1);
      document.getElementById("total-price-js").innerHTML = total;
    }
  });
});