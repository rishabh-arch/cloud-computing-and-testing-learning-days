
$(document).ready( () => {
    
    $('.BM-btn').click(function(){
      var value = $(this).attr("value");
      $(`#${value}`).toggleClass("active");
    
    setTimeout(function(){
      $(`#${value}`).removeClass("active");
    },1000);
    var formData = {
      'PID': $(this).attr('value')
    };
    console.log(formData);
    $.ajax({
          type: 'post',
          url: '/product/user/bookmark/delete',
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
      .done(function(data) {
          console.log(data);
          // return("done");
      })
    });
    // var x = f();
});