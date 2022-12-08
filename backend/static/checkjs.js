function submitLimit() {
    $(`#add`).toggleClass("loader");
    setTimeout(function() {
        btn.setAttribute('disabled', 'disabled');
    }, 1);
}