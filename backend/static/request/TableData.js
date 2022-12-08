$(document).ready(() => {

    $('.up_btn').click(function() {
        var value = $(this).attr("value");
        var formData = {
            'PID': $(this).attr('value')
        };
        console.log(formData);
        $.ajax({
                type: 'post',
                url: '/Update',
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
                newOBJ = data;
                return newOBJ;
            })
    });
});