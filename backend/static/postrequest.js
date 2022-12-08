$(document).ready(() => {
    $("#submit1").click((event) => {
        event.preventDefault();
        doAjax1();
    });
    $("#submit2").click((event) => {
        event.preventDefault();
        doAjax2();
    });
    $("#submit3").click((event) => {
        event.preventDefault();
        doAjax3();
    });
    $("#submit4").click((event) => {
        event.preventDefault();
        doAjax4();
    });
});

function doAjax1() {
    var form = $('#BumperUpload1')[0];
    var data = new FormData(form);
    console.log(data)
    $.ajax({
        type: "POST",
        enctype: 'multipart/form-data',
        url: "/admin/Dashboard/BumperUpload/1",
        data: data,
        processData: false, //prevent jQuery from automatically transforming the data into a query string
        contentType: false,
        cache: false,
        success: (data) => {
            $("#confirmMsg").text(data);
        },
        error: (e) => {
            $("#confirmMsg").text(e.responseText);
        }
    });
}
function doAjax2() {
    var form = $('#BumperUpload2')[0];
    var data = new FormData(form);
    console.log(data)
    $.ajax({
        type: "POST",
        enctype: 'multipart/form-data',
        url: "/admin/Dashboard/BumperUpload/2",
        data: data,
        processData: false, //prevent jQuery from automatically transforming the data into a query string
        contentType: false,
        cache: false,
        success: (data) => {
            $("#confirmMsg").text(data);
        },
        error: (e) => {
            $("#confirmMsg").text(e.responseText);
        }
    });
}
function doAjax3() {
    var form = $('#BumperUpload3')[0];
    var data = new FormData(form);
    console.log(data)
    $.ajax({
        type: "POST",
        enctype: 'multipart/form-data',
        url: "/admin/Dashboard/BumperUpload/3",
        data: data,
        processData: false, //prevent jQuery from automatically transforming the data into a query string
        contentType: false,
        cache: false,
        success: (data) => {
            $("#confirmMsg").text(data);
        },
        error: (e) => {
            $("#confirmMsg").text(e.responseText);
        }
    });
}
function doAjax4() {
    var form = $('#BumperUpload4')[0];
    var data = new FormData(form);
    console.log(data)
    $.ajax({
        type: "POST",
        enctype: 'multipart/form-data',
        url: "/admin/Dashboard/BumperUpload/4",
        data: data,
        processData: false, //prevent jQuery from automatically transforming the data into a query string
        contentType: false,
        cache: false,
        success: (data) => {
            $("#confirmMsg").text(data);
        },
        error: (e) => {
            $("#confirmMsg").text(e.responseText);
        }
    });
}
