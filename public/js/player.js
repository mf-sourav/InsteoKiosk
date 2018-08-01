/**
 * file-player.js
 * Date Modified = 1/8/18
 * function
 * => plays videos in the page
 * => loops through all the videos in video list
 * => shows preloader when video loads
 */
var i = 0;
var videoList = new Array("");
var videoListCheckInterval = 5000;
var checkContentTypeInterval = 5000;
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
}, videoListCheckInterval);
//loops throughout the video play list
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
        if (data.trim() == 'HTML') {
            window.location.href = "http://127.0.0.1:3000/index";
        }
    });
}
//get all the video url that are present locally
function updateMediaList() {
    $.get("http://127.0.0.1:3000/getMedia", function (data, status) {
        videoList = data
    });
}
//initialization
$(document).ready(function () {
    $('.videoContainer').hide();
    setInterval(function () {
        checkContentType();
        updateMediaList();
    }, checkContentTypeInterval);
});