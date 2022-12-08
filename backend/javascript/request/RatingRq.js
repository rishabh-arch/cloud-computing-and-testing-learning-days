$(document).ready(() => {
    $("#submit-rating").click((event) => {
        //stop submit the form, we will post it manually.
        event.preventDefault();
        doAjax();
    });

});

function doAjax() {
    var form = $('#submitform').serializeArray();
    var post_url = $('#submitform').attr("action");
    //   var data = new FormData(form);
    //   console.log(data)
    $.ajax({
        type: "POST",
        // enctype: 'multipart/form-data',
        url: post_url,
        data: form,
        timeout: 2000,
        // processData: false, //prevent jQuery from automatically transforming the data into a query string
        // contentType: false,
        // dataType:'json',
        cache: false,
        success: (data) => {
            $("#confirmMsg").text(data);
            if (data != "Please Login First")
                window.location.reload();
            //reset form

        },
        error: (e) => {
            $("#confirmMsg").text(e.responseText);
        }
    });
}