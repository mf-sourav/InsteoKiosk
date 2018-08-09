$(document).ready(() => {
    $('.connectionError').hide();
    setInterval(function () {
        if (!navigator.onLine) {
            offlineHandler();
        }
        else{
            onlineHandler();
        }
    }, 5000);
});
function offlineHandler() {
    $('.connectionError').show();
    $('.preloader').hide();
}
function onlineHandler() {
    window.location.href = "http://127.0.0.1:3000/index";
}