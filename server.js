/**
 * File=>server.js
 * Date Modified = 1/8/18
 * functions
 * =>runs the application on the host machine
 * =>Includes all the imports of the dependencies 
 */
const PORT = 3000;
const express = require('express');
const app = express();
const path = require('path');
const fs = require('fs');
const bodyParser = require('body-parser');
const request = require('request');
const download = require('download');
const cluster = require('cluster');
const numCPUs = require('os').cpus().length;
const checkUrlInterval = 5000;
const urlResponseTypePath = 'server/data/type.txt';
const Feed = require('rss-to-json');
const jsonfile = require('jsonfile');
//test urls
const htmlUrl = 'http://screen.insteo.com/fpojdf';
const xmlUrl = 'http://api-dev.insteo.com/api/1/AppContent.aspx?type=MRSS&vfk=2d1b3840-c4ce-4f&k=0c37fdcc-7e4a-42&count=30';
//To enable the body parser depenedecy to get form data
app.use(bodyParser.urlencoded({
    extended: true
}));

//array of url of video media
const urlArray = new Array('http://www.html5videoplayer.net/videos/toystory.mp4', 'http://html5videoformatconverter.com/data/images/happyfit2.mp4');

//allows use of sub folders
app.use(express.static('public/js'));
app.use(express.static('server/data'));
app.use(express.static('server/media'));
app.use(express.static('public/styles'));

//extract filename from url to be downloaded
var getFileName = path => path.match(/[-_\w]+[.][\w]+$/i)[0];

//Includes routes.js in server.js module
require('./server/routes.js')(app, path, fs, download, urlArray, getFileName);

/**
 * @name checkUrlResponse 
 * @return void
 * function
 * =>checks for the response from the end point url(HTML/XML) in interval 5secs
 * =>stores the response type in type.txt
 */
setInterval(function () {
    request(htmlUrl, function (error, response, body) {
        try {
            if (body.indexOf('<?xml version=') !== -1) {
                let responsetype = fs.writeFileSync(urlResponseTypePath, 'XML', 'utf8');
                saveRssFeed();
            } else {
                let responsetype = fs.writeFileSync(urlResponseTypePath, 'HTML', 'utf8');
            }
        } catch (exception) {
            console.log("offline");
        }
    });
}, checkUrlInterval);

app.listen(PORT, () => {
    console.log(`Server started on port:${PORT}`);
})