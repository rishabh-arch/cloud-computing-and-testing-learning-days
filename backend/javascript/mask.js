$(document).ready(function(){
    $('#PIN').mask('000000');
    $('#phone').mask('0000000000');
    $('#Market_price').mask('0000000000');
    $('#email').mask("A", {
        translation: {
            "A": { pattern: /[\w@\-.+]/, recursive: true }
        }
    });
})