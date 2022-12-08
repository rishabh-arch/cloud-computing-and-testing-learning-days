$(document).ready(function () {
    // $("#checkkk").click(function (){
    //     var isChecked= $('#checkkk').prop('checked')
    // if (isChecked) {
    //     console.log("check");
    // $("#AT").remove();
    // }
    let isChecked= $('#r1').prop('checked')
    if (isChecked) {
        $(".floater").addClass("floater-left-0");
        $("#WO-select1").css("color","#fff");
        $("#WO-select2").css("color","black");
        $("#Shop_form").css("opacity","0.4");
        $("#Shop_form").children("input").attr('disabled','disabled');


    }
    $("#r1").click(function (){
        let isChecked= $('#r1').prop('checked')
    if (isChecked) {
        $(".floater").addClass("floater-left-0");
        $(".floater").removeClass("floater-left");
        $("#WO-select1").css("color","#fff");
        $("#WO-select2").css("color","black");
        $("#Shop_form").css("opacity","0.4");
        $("#Shop_form").children("input").attr('disabled','disabled');

    }
})
    $("#r2").click(function (){
        let isChecked= $('#r2').prop('checked')
    if (isChecked) {
        $(".floater").addClass("floater-left");
        $(".floater").removeClass("floater-left-0");
        $("#WO-select2").css("color","#fff");
        $("#WO-select1").css("color","black");
        $("#Shop_form").css("opacity","1");
        $("#Shop_form").children("input").removeAttr('disabled');

    }
})

    var current_fs, next_fs, previous_fs; //fieldsets
    var opacity;
    var current = 1;
    var steps = $("fieldset").length;

    setProgressBar(current);

    $(".next").click(function () {

        current_fs = $(this).parent();
        next_fs = $(this).parent().next();

        //Add Class Active
        $("#progressbar li").eq($("fieldset").index(next_fs)).addClass("active");

        //show the next fieldset
        next_fs.show();
        //hide the current fieldset with style
        current_fs.animate({ opacity: 0 }, {
            step: function (now) {
                // for making fielset appear animation
                opacity = 1 - now;

                current_fs.css({
                    'display': 'none',
                    'position': 'relative'
                });
                next_fs.css({ 'opacity': opacity });
            },
            duration: 500
        });
        setProgressBar(++current);
    });

    $(".previous").click(function () {

        current_fs = $(this).parent();
        previous_fs = $(this).parent().prev();

        //Remove class active
        $("#progressbar li").eq($("fieldset").index(current_fs)).removeClass("active");

        //show the previous fieldset
        previous_fs.show();

        //hide the current fieldset with style
        current_fs.animate({ opacity: 0 }, {
            step: function (now) {
                // for making fielset appear animation
                opacity = 1 - now;

                current_fs.css({
                    'display': 'none',
                    'position': 'relative'
                });
                previous_fs.css({ 'opacity': opacity });
            },
            duration: 500
        });
        setProgressBar(--current);
    });

    function setProgressBar(curStep) {
        var percent = parseFloat(100 / steps) * curStep;
        percent = percent.toFixed();
        $(".progress-bar")
            .css("width", percent + "%")
    }

    $("#submit-shop").click(function () {
        Emptyvalidation(pic)
        function Emptyvalidation(inputtxt) {
            if (inputtxt.value.length == 0) {
                $(".warn").addClass("warn-visible");
            }
            else {
                document.inputtxt.style.background = 'White';
                return false;
            }
        }
    })

    // Emptyvalidation("fname")

});