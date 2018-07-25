/**
 * File=>server.js
 * functions
 * =>runs the application on the host machine
 * =>provides api
 * =>includes npm dependencies
 * =>controls file system
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
function getFileName(path) {
    return path.match(/[-_\w]+[.][\w]+$/i)[0];
}

//sends the config.html file in response
app.get('/config', function (req, res) {
    res.sendFile('config.html', {
        root: path.join(__dirname, '../public')
    });
});

//sends the index.html file in response
app.get('/index', function (req, res) {
    res.sendFile('index.html', {
        root: path.join(__dirname, '../public')
    });
});

//sends the player.html file in response
app.get('/player', function (req, res) {
    //cycles through url list
    for (let i = 0; i < urlArray.length; i++) {
        //checks if media file is present
        if (fs.existsSync(__dirname + '/media/' + getFileName(urlArray[i]))) {} else {
            //if not present download the content synchronously
            download(urlArray[i], 'media').then(() => {
                //after downloading write files to media_list file
                fs.appendFileSync(__dirname + '/data/' + 'media_list.txt', getFileName(urlArray[i]) + "\r\n");
            });
        }
    }
    res.sendFile('player.html', {
        root: path.join(__dirname, '../public')
    });
});

//api call to get the type of response from url html/xml
app.get('/type', function (req, res) {
    fs.readFile(__dirname + "/type.txt", 'utf8', function (err, data) {
        res.end(data);
    });
});

//extracts pin code from config file
app.get('/getCode', function (req, res) {
    fs.readFile(__dirname + "/data/config_details.txt", 'utf8', function (err, data) {
        var code = (data.split('URL=')[1]).split('PIN=')[0].trim();
        res.end(code);
    });
});

// CURL Request
setInterval(function () {
    var htmlUrl = 'http://screen.insteo.com/fpojdf';
    var xmlUrl = 'http://api-dev.insteo.com/api/1/AppContent.aspx?type=MRSS&vfk=2d1b3840-c4ce-4f&k=0c37fdcc-7e4a-42&count=30';
    var textUrl = 'http://172.16.9.175/others/kiosk/Insteo_MRSS.xml';
    request(htmlUrl, function (error, response, body) {
        if (body != undefined) {
            if (body.indexOf('<?xml version=') !== -1) {
                var type = fs.writeFileSync('type.txt', 'XML', 'utf8');
            } else {
                var type = fs.writeFileSync('type.txt', 'HTML', 'utf8');
            }
        }
    });
}, 5000);

//api call to get media list from media_list.txt
app.get('/getMedia', function (req, res) {
    var data = fs.readFileSync(__dirname + '/data/' + 'media_list.txt', 'utf8');
    //send array of media files name
    res.send(data.split(/\n/));
});

//reads the xml file in development
app.get('/getXml', function (req, res) {
    var xml = fs.readFileSync('test.xml', 'utf8');
    var data;
    parseString(xml, function (err, result) {
        data = JSON.stringify(result);
        res.send(data);
    });
});

//extracts pin from /data/config_details.txt
app.get('/getPin', function (req, res) {
    var pin = fs.readFileSync(__dirname + '/data/config_details.txt', 'utf8').split('PIN=')[1].trim();
    res.end(pin);
});

//saves pin & password into /data/config_details.txt
app.post('/setPinPassword', function (req, res) {
    var conf = 'URL=' + req.body.url + "\nPIN=" + req.body.pin;
    fs.writeFile(__dirname + '/data/config_details.txt', conf, 'utf8', function (err) {
        if (err) {
            res.send("error");
        };
    });
    res.send("success");
});

//appends listner at port 3000
app.listen(3000, () => {
    console.log('Server started on port:3000');
});
