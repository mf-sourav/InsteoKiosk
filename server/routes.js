//sends the index.html file in response
module.exports = function (app, path, fs, download, urlArray, getFileName) {
    app.get('/index', function (req, res) {
        res.sendFile('index.html', {
            root: path.join(__dirname, '../public')
        });
    });

    //sends the config.html file in response
    app.get('/config', function (req, res) {
        res.sendFile('config.html', {
            root: path.join(__dirname, '../public')
        });
    });

    //sends the player.html file in response
    app.get('/player', function (req, res) {
        //cycles through url list
        var urlArrayLength = urlArray.length;
        for (let i = 0; i < urlArrayLength; i++) {
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
}