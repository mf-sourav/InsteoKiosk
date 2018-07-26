var i = 0;
var videoList = new Array("");
//checks every 6 seconds whether video list has any videos to play
var waiter = setInterval(function () {
    if (videoList.length > 1) {
        $("#videoarea").attr({
            "src": videoList[0]
        });
        $('.loader').hide();
        $('.videoContainer').show();
        clearInterval(waiter);
    }
}, 6000);
//loops through out the video play list
function next(e) {
    i += 1;
    if (i == videoList.length - 1) {
        i = 0;
    }
    $("#videoarea").attr({
        "src": videoList[i]
    });
}
//api request for determining html response type
function checkContentType() {
    $.get("http://127.0.0.1:3000/type", function (data, status) {
        console.log(data);
        if (data.trim() == 'HTML') {
            window.location.href = "http://127.0.0.1:3000/index";
        }
    });
}
//get all the video url that are present locally
function updateMediaList() {
    $.get("http://127.0.0.1:3000/getMedia", function (data, status) {
        videoList = data
        console.log(videoList);
    });
}
//initialization
$(document).ready(function () {
    $('.videoContainer').hide();
    setInterval(function () {
        checkContentType();
        updateMediaList();
    }, 5000);
});