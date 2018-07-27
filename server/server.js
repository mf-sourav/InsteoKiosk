/**
 * File=>server.js
 * functions
 * =>runs the application on the host machine
 * =>Includes all the imports of the dependencies 
 */
//specifying port number
const PORT = 3000;
//all require for npm dependencies
const express = require('express');
const app = express();
const path = require('path');
const fs = require('fs');
const bodyParser = require('body-parser');
const parseString = require('xml2js').parseString;
const request = require('request');
const download = require('download');
var cluster = require('cluster');
var numCPUs = require('os').cpus().length;

//To enable the body parser depenedecy to get form data
app.use(bodyParser.urlencoded({
    extended: true
}));

//array of url of video media
const urlArray = new Array('http://www.html5videoplayer.net/videos/toystory.mp4', 'http://html5videoformatconverter.com/data/images/happyfit2.mp4');

//allows use of sub folders
app.use(express.static('../public/js'));
app.use(express.static('data'));
app.use(express.static('media'));
app.use(express.static('../public/styles'));

//extract filename from url to be downloaded
var getFileName = path => path.match(/[-_\w]+[.][\w]+$/i)[0];

//Includes routes.js in server.js module
require('./routes.js')(app, path, fs, download, urlArray, getFileName);

/**
 * @name checkUrlResponse 
 * @return void
 * function
 * =>checks for the response from the end point url(HTML/XML) in interval 5secs
 * =>stores the response type in type.txt
 */
setInterval(function () {
    let htmlUrl = 'http://screen.insteo.com/fpojdf';
    let xmlUrl = 'http://api-dev.insteo.com/api/1/AppContent.aspx?type=MRSS&vfk=2d1b3840-c4ce-4f&k=0c37fdcc-7e4a-42&count=30';
    request(htmlUrl, function (error, response, body) {
        try {

            if (body.indexOf('<?xml version=') !== -1) {
                let responsetype = fs.writeFileSync('type.txt', 'XML', 'utf8');
            } else {
                let responsetype = fs.writeFileSync('type.txt', 'HTML', 'utf8');
            }

        } catch (exception) {
            console.log("offline");
        }
    });
}, 5000);

/**
 * function=>
 * creates node js cluster for multi threading
 * creates n workers depending on number of cpu's
 * forks child processes for handling http request
 */
//checks if it is a master process
if (cluster.isMaster) {
    // Fork workers.
    // creates number of workers depending on cpu count
    for (var i = 0; i < numCPUs; i++) {
        cluster.fork();
    }
} else {
    // if cluster is worker then it will listern to port
    //appends listner at specified port
    app.listen(PORT, () => {
        console.log(`Server started on port:${PORT}`);
    });
}