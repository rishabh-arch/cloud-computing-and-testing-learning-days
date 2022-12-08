$(document).ready(function(){
    $("#submitForm1").on("change", function(){
       var formData = new FormData(this);
       $.ajax({
           type : "POST",
           enctype: 'multipart/form-data',
           url  : "/Dashboard/profile/changeprofile",
          cache: false,
          contentType : false, // you can also use multipart/form-data replace of false
          processData: false,
          data: formData,
          success:function(response){
           $("#images").val('');
           alert("Image uploaded Successfully");
          }
       });
    });
 });