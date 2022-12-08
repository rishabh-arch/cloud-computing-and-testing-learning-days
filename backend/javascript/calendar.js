$(document).ready(function(){
    $(function() {
        var date = new Date();
    $('input[name="daterange"]').daterangepicker({
    "startDate":"01/01/2021" ,
    "endDate": `${date.getDate()}/${date.getMonth()+1}/${date.getFullYear()}`,
    opens: 'center',
    locale: {
    format: 'DD/MM/YYYY'
    }
    });
    });
    });