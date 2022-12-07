var getUrl = window.location;
$baseUrl = getUrl.protocol + "//" + getUrl.host + "/" + getUrl.pathname.split('/')[1]; // + '/';
//console.log($baseUrl);
$(document).ready(function () {

    $("#newentrydv input[name$='resource']").click(function () {
        var test = $(this).attr('data-id');//$(this).val();
        $("#newentrydv #resource" + test).find('input[type="text"]').val('');
        $('#newentrydv input[type="checkbox"]:checked').prop('checked', false);
        $("#newentrydv div.desc").hide();
        $("#newentrydv #resource" + test).show();
        $("#newentrydv #resource" + (test - 1)).find('input[type="text"]').val('');
        $("#newentrydv #resource" + test - 1).find('input[type="checkbox"]').prop('checked', false);
        //console.log($("#resource" + (test-1)).find('input').val()+' dsdsd '+(test-1));
    });

    $('.ageg').change(function () {
        $('.errage').remove();
        if ($(this).val() < 18 || $(this).val() > 60) {
            //alert("The age must be a number between 18 and 60");
            $(this).val("");
            $(this).parent().append("<span class='text-danger errage'>The age must be a number between 18 and 60 Years.</span>");
            return false;
        }
    });

    $('#all_district_city').change(function () {
//        console.log($(this).is(':checked'));
        if ($(this).is(':checked') == true) {
            $(".all_district_city").hide();
        } else {
            $(".all_district_city").show();
        }
    });
    $('#updtall_district_city').change(function () {
        //console.log($(this).is(':checked'));
        if ($(this).is(':checked') == true) {
            $(".updtall_district_city").hide();
        } else {
            $(".updtall_district_city").show();
        }
    });
});

$(document).ready(function () {
    $('select[name="state_id"]').select2({placeholder: "Select State"});
    $('select[name="district_id"]').select2({placeholder: "Select District"});
    $('select[name="village_id"]').select2({placeholder: "Select Town/City"});

    $('select[name="srch_state_id"]').select2({placeholder: "Select State"});
    $('select[name="srch_district_id"]').select2({placeholder: "Select District"});
    $('select[name="srch_village_id"]').select2({placeholder: "Select Town/City"});


    //$('select[name="update_state_id"]').select2({placeholder: "Select State"});
    $('select[name="update_district_id"]').select2({placeholder: "Select District"});
    $('select[name="update_village_id"]').select2({placeholder: "Select Town/City"});

    $('#update_splrdetals select[name="update_district_id"]').change(function () {
        var districtID = $(this).val();
        $('#update_splrdetals select[name="village_id"]').html('<option value="#" selected>Loading..Please wait!</option>');
        village_bydistrictID(districtID, 'update_splrdetals');
    });

    $('#Hospital').select2({
        tags: true,
    });

    $(".contributorbtn").click(function () {
        $("#contri-form").show();
        $("#distrbr-resource-form, #tbdv").hide();
    });
    $(".distrbtrbtn").click(function () {
        $("#distrbr-resource-form").show();
        $("#contri-form, #tbdv").hide();
    });
    $("#distrbr-resource-form").on('submit', function (e) {
        e.preventDefault();
        $("#verifyotpdiv").hide();
        $(".mstxtsss, .reqerr").remove();
        $.ajax({
            type: "POST",
            url: "send-form-data",
            data: $(this).serializeArray(),
            success: function (resp) { //alert(resp);
                //console.log(resp);
                $(resp).insertAfter('#ftrbtn');
                setTimeout(function () {
                    $(".mstxtsss").remove();
                }, 2000);
            }
        });
    });

    $("#newentry-form").on('submit', function (e) {
        e.preventDefault();
        $("#newentryfrmbtn").prop("disabled", true);
        $("#newentryfrmbtn").text("Please wait..");
        $("#formerr").html("");
        $.ajax({
            type: "POST",
            url: "newentry-form-data",
            data: $(this).serializeArray(),
            success: function (resp) {
                //console.log(resp);
                $("#newentryfrmbtn").prop("disabled", false);
                $("#newentryfrmbtn").text("Submit");
                $("#formerr").html(resp);
            }
        });
    });

    $("#smsOtpbtn").click(function () {
        $('input[name="verify_otp_mobile"]').removeClass('has-error');
        if ($('input[name="verify_otp_mobile"]').val() != "") {
            $("#smsOtpbtn").prop("disabled", true);
            sendMobileOtp($('input[name="verify_otp_mobile"]').val());
            $(".smsotptxt").removeClass('hidden');
        } else {
            $(".smsotptxt").addClass('hidden');
            $("#smsOtpbtn").prop("disabled", false);
            $('input[name="verify_otp_mobile"]').addClass('has-error');
        }
    });

    $("#sendOtpbtn").click(function () {
        $('input[name="sendotp_mobile"]').removeClass('has-error');
        if ($('input[name="sendotp_mobile"]').val() != "") {
            $("#sendOtpbtn").prop("disabled", true);
            sendloginOTP($('input[name="sendotp_mobile"]').val());
            $(".smsotp").removeClass('hidden');
        } else {
            $(".smsotp").addClass('hidden');
            $("#sendOtpbtn").prop("disabled", false);
            $('input[name="sendotp_mobile"]').addClass('has-error');
        }
    });

    $("#verify_Otpbtn").click(function () {
        $('input[name="verify_lognotp"]').removeClass('has-error');
        if ($('input[name="verify_lognotp"]').val() != "") {
            $("#verify_Otpbtn").prop("disabled", true);
            verifyloginMobileOtp($('input[name="verify_lognotp"]').val());
            $(".loginotptxt").removeClass('hidden');
        } else {
            $(".loginotptxt").addClass('hidden');
            $("#verify_Otpbtn").prop("disabled", false);
            $('input[name="verify_lognotp"]').addClass('has-error');
        }
    });

    $("#searchform").on('submit', function (e) {
        e.preventDefault();
        $(".searchbtn").text("Searching..");
        $("#ajaxsearchreslt").html("");
        $.ajax({
            type: "POST",
            url: "search-form-data",
            data: $(this).serializeArray(),
            success: function (resp) { //console.log(resp); return false;
                $(".searchbtn").text("Search");
                $("#ajaxsearchreslt").html(resp);
            }
        });
    });

    $('#newentry-form select[name="district_id"]').change(function () {
        var districtID = $(this).val();
        $('#newentry-form select[name="village_id"]').html('<option value="#" selected>Loading..Please wait!</option>');
        village_bydistrictID(districtID, 'newentry-form');
        hospital_bydistrictID(districtID);
    });

    $('#distrbr-resource-form select[name="district_id"]').change(function () {
        var districtID = $(this).val();
        $('#distrbr-resource-form select[name="village_id"]').html('<option value="#" selected>Loading..Please wait!</option>');
        //setTimeout(function () {
        village_bydistrictID(districtID, 'distrbr-resource-form');
        //}, 2500);
    });

    $('#searchform select[name="srch_district_id"]').change(function () {
        var districtID = $(this).val();
        $('#searchform select[name="village_id"]').html('<option value="#" selected>Loading..Please wait!</option>');
        village_bydistrictID(districtID, 'searchform');
    });


    // Update Status
    $('#userupdatefrmbtn').click(function () {
        var getUrl = window.location;
        var bUrl = getUrl.protocol + "//" + getUrl.host + "/" + getUrl.pathname.split('/')[0]; // + '/';

        var ustatus = $('input[name="status"]:checked').val();
        var userkey = $('input[name="userkey"]').val();
        if (typeof ustatus !== "undefined" && userkey != '') {
            $.ajax({
                type: "POST",
                url: bUrl + "update-status-sms",
                data: {status: ustatus, userkey: userkey},
                success: function (resp) {
                    $("#updformerr").html(resp);
                    $('input[name="status"]').prop('checked', false);
                }
            });

        } else {
            alert("Please enter mobile no to update the status");
        }
    });
});


function sendMobileOtp(mbl) {
    $("#smsOtpbtn").text("Verifying..");
    $.ajax({
        type: "POST",
        url: "verify-sms-otp",
        data: {mobile_otp: mbl, member_mobile: $('input[name="member_mobile"]').val()},
        success: function (resp) {
            $("#smsOtpbtn").prop("disabled", false);
            $("#smsOtpbtn").text("Verify OTP");
            $('.smsmailotp').remove();
            $(resp).insertAfter('.mbldv');
            setTimeout(function () {
                $('.smsmailotp').remove();
            }, 2500);
        }
    });
}

function sendloginOTP(mbl) {
    $("#sendOtpbtn").text("Sending..");
    $("#verifylogin_otp").hide();
    $.ajax({
        type: "POST",
        url: "send-sms-otp",
        data: {sendotp_mobile: mbl},
        success: function (resp) {
            $("#sendOtpbtn").prop("disabled", false);
            $("#sendOtpbtn").text("Send OTP");
            if (resp == 'error') {
                showToastr('error', 'Mobile number is not registered!', 'Response:');
            } else {
                $('.smsotp').remove();
                $(resp).insertAfter('.mbldv');
                $("#verifylogin_otp").show();
                setTimeout(function () {
                    $('.smsotp').remove();
                }, 2500);
            }
        }
    });

}

function verifyloginMobileOtp(otp) {
    $("#verify_Otpbtn").text("Verifying..");
    $.ajax({
        type: "POST",
        url: "verify-login-otp",
        data: {verify_lognotp: otp, sendotp_mobile: $('input[name="sendotp_mobile"]').val()},
        success: function (resp) {
            $('.loginotptxt').remove();
            $(resp).insertAfter('.loginmbldv');
            $("#verify_Otpbtn").prop("disabled", false);
            $("#verify_Otpbtn").text("Verify OTP");
            setTimeout(function () {
                $('.loginotptxt').remove();
            }, 2500);
        }
    });
}

function disttrict_bystateID(ths, dname) {
    var state_id = $(ths).val();
    var enableAlldistrct = $(ths).attr('data-next');
    if (state_id != '') {
        if (enableAlldistrct == "enableAlldistrct") {
            $("#enableAlldistrct").show();
        } else {
            $("#enableAlldistrct").hide();
        }
        $('select[name="' + dname + '"]').html("");
        $.ajax({
            url: $baseUrl + 'district-data',
            data: ({state_id: state_id}),
            type: 'post',
            success: function (data) {
                if (data != "") {
                    $('select[name="' + dname + '"]').html(data);
                }
            }
        });
    } else {
        $("#enableAlldistrct").hide();
    }
}

function getresource_subset(ths, sbname) {
    var resrcname = $(ths).val();
    if (resrcname != '') {
        $('select[name="' + sbname + '"]').html('<option value="#" selected>Loading..Please wait!</option>');
        //$('select[name="' + sbname + '"]').html("");
        $.ajax({
            url: $baseUrl + 'resource-subset-data',
            data: ({resource_typeid: resrcname}),
            type: 'post',
            success: function (data) {
                if (data != "") {
                    $('select[name="' + sbname + '"]').html(data);
                }
            }
        });
    }
}
//not using
function subdisttrict_bydistrictID(ths, sdname, vname) {
    var district_id = $(ths).val();
    if (district_id != '') {
        village_bydistrictID(district_id, vname);
        $('select[name="' + sdname + '"]').html("");
        $.ajax({
            url: $baseUrl + 'sub-district-data',
            data: ({district_id: district_id}),
            type: 'post',
            success: function (data) {
                if (data != "") {
                    $('select[name="' + sdname + '"]').html(data);
                }
            }
        });
    }
}

function village_bydistrictID(districtID, frmid) {
    if (districtID != '') {
        //$('#' + frmid + ' select[name="village_id"]').html("");
        $.ajax({
            url: $baseUrl + 'village-data',
            data: ({district_id: districtID}),
            type: 'post',
            success: function (data) { //console.log("DDD");
                if (data != "") {
                    $('#' + frmid + ' select[name="village_id"]').html(data);
                }
            }
        });
    }
}

function hospital_bydistrictID(districtID) {
    if (districtID != '') {
        $('select[name="covid_beds[Hospital]"]').html("");
        $.ajax({
            url: $baseUrl + 'hospital-data',
            data: ({district_id: districtID}),
            type: 'post',
            success: function (data) {
                if (data != "") {
                    $('select[name="covid_beds[Hospital]"]').html(data);
                }
            }
        });
    }
}
//clone Div dynamicaly
var regex = /^(.+?)(\d+)$/i;

function cloneDiv(limit) {
    var cloneIndex = $(".clonedInput").length;
    var divID = '#clone_ifvisited_abroadDiv';
    var divclass = $(divID).attr('class');
    if (limit < cloneIndex) {
        alert("You can't add more than " + cloneIndex);
        return false;
    }
    $(divID).clone()
            .insertAfter("." + divclass + ":last")
            .attr("id", 'clone_ifvisited_abroadDiv' + cloneIndex)
            .find(".addrmvbtn").html('<a class="btn btn-xs btn-danger" divname="clone_ifvisited_abroadDiv' + cloneIndex + '" onclick="removeClone(this)" title="Remove"><i class="fa fa-times-circle"></i></a>')
            .find("*")
            .each(function () {
                var ids = this.id || "";
                var match = ids.match(regex) || [];
                if (match.length == 3) {
                    this.id = match[1] + (cloneIndex);
                }
            });
    $(divID + cloneIndex + " input").val("");
    //$(divID + cloneIndex + " .pcount").text(cloneIndex);
    $(divID + cloneIndex).find('.error').remove();
    //$(divID + cloneIndex).find('.error').removeClass('error');
    $(divID + cloneIndex).find('.req_img').removeClass('req_img');//remove from product img input
    $(divID + cloneIndex).find('.has-error').removeClass('has-error');//remove from product img input
    cloneIndex++;
    $(".datepicker").datepicker({
        autoclose: true,
    });
}
function removeClone(IDindex) {
    var div_id = $(IDindex).attr('divname');
    $("#" + div_id).remove();
}

function isNumber(evt) {
    var charCode = (evt.which) ? evt.which : evt.keyCode;
    if (charCode != 46 && charCode > 31 && (charCode < 48 || charCode > 57)) {
        return false;
    }
    return true;
}

function validateEmail(ths) {
    var reg = /^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/;
    var emailField = $(ths).val();
    if (reg.test(emailField) == false) {
        $(ths).val("");
        $(ths).parent().find(".error").remove();
        $(ths).parent().append('<span class="error">Invalid Email ID</span>');
        return false;
    } else {
        $(ths).parent().find(".error").remove();
        return true;
    }
}

function validateMobile(ths) {
    var inputtxt = $(ths).val();
    var phoneno = /^[6-9]{1}[0-9]{9}$/;
    if (inputtxt.match(phoneno)) {
        $(ths).parent().find(".error").remove();
        return true;
    } else {
        $(ths).val("");
        $(ths).parent().find(".error").remove();
        $(ths).parent().append('<span class="error">Invalid Mobile Number</span>');
        return false;
    }
}
function validateVoterID(ths) {
    var inputvalues = $(ths).val();
    var regex = /^([a-zA-Z]){3}([0-9]){7}?$/g;
    if (!regex.test(inputvalues)) {
        $(ths).val("");
        $(ths).parent().find(".error").remove();
        $(ths).parent().append('<span class="error">Invalid Voter ID Number</span>');
        return regex.test(inputvalues);
    } else {
        $(ths).parent().find(".error").remove();
        return true;
    }
}

function validatePan(ths) {
    var inputvalues = $(ths).val();
    var regex = /[A-Z]{5}[0-9]{4}[A-Z]{1}$/;
    if (!regex.test(inputvalues)) {
        $(ths).val("");
        $(ths).parent().find(".error").remove();
        $(ths).parent().append('<span class="error">Invalid PAN Number</span>');
        return regex.test(inputvalues);
    } else {
        $(ths).parent().find(".error").remove();
        return true;
    }
}

function validateadhar(ths) { //console.log(ths); return false;
    var adharNo = $(ths).val();//alert(adharNo);//return false;
    if (validate_adhar(adharNo) == false) {
        $(ths).val("");
        $(ths).parent().find(".error").remove();
        $(ths).parent().append('<span class="error">Invalid Aadhaar Number</span>');
        return false;
    } else {
        $(ths).parent().find(".error").remove();
        return true;

    }
}

function AlphaNumSpace(inputtxt) {
    var chars = /^[a-z\d\-_\s]+$/i;
    var textbx_value = inputtxt.value;
    var textname = inputtxt.name;
    if (textbx_value.match(chars)) {
        return true;
    } else {
        alert("Enter valid characters.(Special chars not allowed)");
        $("input[name=" + textname + "]").val('');
        return false;

//        $("input[name=" + textname + "]").parent().html("<span class='error'>Enter valid characters.(Special chars not allowed)</span>");
//        setTimeout(function () {
//            $("input[name=" + textname + "]").parent().next('span').html("");
//        }, 5000);
//        return false;
    }
}


function showToastr(type, msg, header) {
    Command: toastr[type](msg, header);
}

$(function () {
    $("#without_oxygen").on("click", function () {
        $(".wo_oxy").toggle(this.checked);
    });
    $("#with_oxygen").on("click", function () {
        $(".wid_oxy").toggle(this.checked);
    });
    $("#lif_support").on("click", function () {
        $(".lif_sup").toggle(this.checked);
    });
    $("#icu-chek").on("click", function () {
        $(".icu").toggle(this.checked);
    });
    $("#bwo-chek").on("click", function () {
        $(".bwo").toggle(this.checked);
    });
    $("#cyl-chek").on("click", function () {
        $(".cyl").toggle(this.checked);
    });
    $("#ref-chek").on("click", function () {
        $(".ref").toggle(this.checked);
    });
    $("#flowmtr-chek").on("click", function () {
        $(".flowmtr").toggle(this.checked);
    });
    $("#fab-chek").on("click", function () {
        $(".fab").toggle(this.checked);
    });
    $("#rem-chek").on("click", function () {
        $(".rem").toggle(this.checked);
    });
    $("#toc-chek").on("click", function () {
        $(".toc").toggle(this.checked);
    });
    $("#vitc-chek").on("click", function () {
        $(".vitc").toggle(this.checked);
    });
    $("#inver-chek").on("click", function () {
        $(".inver").toggle(this.checked);
    });
    $("#doxy-chek").on("click", function () {
        $(".doxy").toggle(this.checked);
    });
    $("#zinc-chek").on("click", function () {
        $(".zinc").toggle(this.checked);
    });
    $("#mont-chek").on("click", function () {
        $(".mont").toggle(this.checked);
    });
    $("#oximtr-chek").on("click", function () {
        $(".oximtr").toggle(this.checked);
    });
    $("#azy-chek").on("click", function () {
        $(".azy").toggle(this.checked);
    });
    $("#oxycon-chek").on("click", function () {
        $(".oxycon").toggle(this.checked);
    });
    $("#dexam-chek").on("click", function () {
        $(".dexam").toggle(this.checked);
    });
    $("#predm-chek").on("click", function () {
        $(".predm").toggle(this.checked);
    });
    $("#rtpcr").on("click", function () {
        $(".rtpcr").toggle(this.checked);
    });
    $("#antiign").on("click", function () {
        $(".antiign").toggle(this.checked);
    });
    $("#crp").on("click", function () {
        $(".crp").toggle(this.checked);
    });
    $("#ferrritin").on("click", function () {
        $(".ferrritin").toggle(this.checked);
    });
    $("#dimr").on("click", function () {
        $(".dimr").toggle(this.checked);
    });
    $("#cbc").on("click", function () {
        $(".cbc").toggle(this.checked);
    });
    $("#il6").on("click", function () {
        $(".il6").toggle(this.checked);
    });

    $("#clearloc_1").click(function () {
        console.log("Test");
        $("#supplrloc .clrtxt").html('');
        $("#supplrloc .slt2").val('').trigger('change');
        $('#supplrloc').find('input[type="text"]').val('');
        $("#all_district_city").prop('checked', false);
        $(".all_district_city").show();
    });
    $("#clearcont_1").click(function () {
        $('#supplrCon').find('input[type="text"]').val('');
    });

    $("#update-newentry-form").on('submit', function (e) {
        e.preventDefault();
        $("#updformerr").html("");
        $.ajax({
            type: "POST",
            url: "update-newentry-form-data",
            data: $(this).serializeArray(),
            success: function (resp) {
                //console.log(resp);
                $("#updformerr").html(resp);
            }
        });
    });

});


function clearlocation_data() {
    $("#supplrloc .clrtxt").html('');
    $("#supplrloc .slt2").val('').trigger('change');
    $('#supplrloc').find('input[type="text"]').val('');
    $("#all_district_city").prop('checked', false);
    $(".all_district_city").show();
}
function clearcontact_data() {
    $('#supplrCon').find('input[type="text"]').val('');
}
function clearResourceData() {
    $("#clearloc, #clearcont").show();
    $('#newentrydv input[type="radio"]').removeAttr('checked');
    $('#newentrydv input[type="radio"]').prop('checked', false);
    for (var i = 0; i < 5; i++) {
        $('#newentrydv #resource' + i + ' input[type="text"]').val('');
        $('#newentrydv #resource' + i + ' select').val('');
        $('#newentrydv #resource' + i + ' input[type=checkbox]').prop('checked', false);
    }
}
function gotologin() {
    $("#checklogin").modal('hide');
    $('#defaulttab li a').eq(1).trigger('click');
}