$(document).ready(function () {
    var siteUrl = 'http://screen.insteo.com/';

    $.get("http://127.0.0.1:3000/getCode", function (data, status) {
        $('#global_iframe').attr('src', siteUrl + data);
    });
    setInterval(function () {
        $.get("http://127.0.0.1:3000/type", function (data, status) {
            console.log(data);
            if (data.trim() == 'XML') {
                window.location.href = "http://127.0.0.1:3000/player";
            }
        });
    }, 6000);
});