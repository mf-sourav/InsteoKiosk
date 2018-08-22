/**
 * File=>server.js
 * Date Modified = 22/8/18
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
const crypto = require('crypto');
const checkUrlInterval = 5000;
const urlResponseTypePath = 'server/data/type.txt';
const configFilePath = '/server/data/config.json';
var config = {};

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
app.use(express.static('public/assets'));

//extract filename from url to be downloaded
var getFileName = path => path.match(/[-_\w]+[.][\w]+$/i)[0];

config = getConfig();

//test urls
const htmlUrl = config.htmlUrl;
const xmlUrl = config.xmlUrl;
//Includes routes.js in server.js module
require('./server/routes.js')(app, path, fs, download, urlArray, getFileName, crypto,config);

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

/**
 * @name getConfig
 * @return object
 * function
 * =>retrives all path config from config.json
 */
function getConfig() {
    try {
        var data = fs.readFileSync(__dirname + configFilePath, 'utf8');
        var obj = JSON.parse(data);
        return obj;
    } catch (error) {
        console.log(error);
    }
}

app.listen(PORT, () => {
    console.log(`Server started on port:${PORT}`);
})