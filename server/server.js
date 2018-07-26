/**
 * File=>server.js
 * functions
 * =>runs the application on the host machine
 * =>Includes all the imports of the dependencies 
 */
//all require for npm dependencies
var express = require('express');
var app = express();
var path = require('path');
var fs = require('fs');
var bodyParser = require('body-parser');
var parseString = require('xml2js').parseString;
var request = require('request');
var download = require('download');

//To enable the body parser depenedecy to get form data
app.use(bodyParser.urlencoded({
    extended: true
}));

//array of url of video media
var urlArray = new Array('http://www.html5videoplayer.net/videos/toystory.mp4', 'http://html5videoformatconverter.com/data/images/happyfit2.mp4');

//allows use of sub folders
app.use(express.static('../public/js'));
app.use(express.static('data'));
app.use(express.static('media'));
app.use(express.static('../public/styles'));

//extract filename from url to be downloaded
var getFileName = path => path.match(/[-_\w]+[.][\w]+$/i)[0];

//binds main server.js with routes.js 
require('./routes.js')(app, path, fs, download, urlArray, getFileName);

// CURL Request to check the response from the url every 5secs
setInterval(function () {
    var htmlUrl = 'http://screen.insteo.com/fpojdf';
    var xmlUrl = 'http://api-dev.insteo.com/api/1/AppContent.aspx?type=MRSS&vfk=2d1b3840-c4ce-4f&k=0c37fdcc-7e4a-42&count=30';
    request(htmlUrl, function (error, response, body) {
        try {
            let responsetype;
            if (body.indexOf('<?xml version=') !== -1) {
                responsetype = fs.writeFileSync('type.txt', 'XML', 'utf8');
            } else {
                responsetype = fs.writeFileSync('type.txt', 'HTML', 'utf8');
            }

        } catch (exception) {
            console.log("offline");
        }
    });
}, 5000);

//appends listner at port 3000
app.listen(3000, () => {
    console.log('Server started on port:3000');
});