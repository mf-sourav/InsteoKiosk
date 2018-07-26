/**
 * File-routes.js
 * functions
 * =>holds the routings
 * =>provides api
 * @param {*stores the instance of express} app 
 * @param {*path holds the instance of express path module for path. functions} path 
 * @param {*holds node js filehandling module} fs 
 * @param {*import for download package to download files from url & store it} download 
 * @param {*variable that holds all links for downloading} urlArray 
 * @param {*function to parse filename from url} getFileName 
 */
module.exports = function (app, path, fs, download, urlArray, getFileName) {
    /**
     * @Route
     * @name /index
     * @method GET
     * @return file
     * function
     * =>sends the index.html file in response
     */
    app.get('/index', function (req, res) {
        res.sendFile('index.html', {
            root: path.join(__dirname, '../public')
        });
    });

    /**
     * @Route
     * @name /config
     * @method GET
     * @return file
     * function
     * =>sends the config.html file in response
     */
    app.get('/config', function (req, res) {
        res.sendFile('config.html', {
            root: path.join(__dirname, '../public')
        });
    });

    /**
     * @Route
     * @name /player
     * @method GET
     * @return file
     * function
     * =>sends the player.html file in response
     * =>checks if the media from the url is already present or not
     * =>downloads new media files if not present
     */
    app.get('/player', function (req, res) {
        //cycles through url list
        var urlArrayLength = urlArray.length;
        for (let i = 0; i < urlArrayLength; i++) {
            //parses name of the file from url
            let mediaName = getFileName(urlArray[i]);
            //checks if media file is present
            if (fs.existsSync(__dirname + '/media/' + mediaName)) {} else {
                //if not present download the content synchronously
                download(urlArray[i], 'media').then(() => {
                    //after downloading write files to media_list file
                    fs.appendFileSync(__dirname + '/data/' + 'media_list.txt', mediaName + "\r\n");
                });
            }
        }
        res.sendFile('player.html', {
            root: path.join(__dirname, '../public')
        });
    });

   /**
     * @Route/api call
     * @name /type
     * @method GET
     * @return string
     * function
     * =>returns the type of response that app is getting from the url(HTML/XML)
     */
    app.get('/type', function (req, res) {
        fs.readFile(__dirname + "/type.txt", 'utf8', function (err, data) {
            res.end(data);
        });
    });

   /**
     * @Route/api call
     * @name /getCode
     * @method GET
     * @return string
     * function
     * =>returns the 6 characters unique url code from config_details.txt
     */
    app.get('/getCode', function (req, res) {
        fs.readFile(__dirname + "/data/config_details.txt", 'utf8', function (err, data) {
            var code = (data.split('URL=')[1]).split('PIN=')[0].trim();
            res.end(code);
        });
    });

   /**
     * @Route/api call
     * @name /getMedia
     * @method GET
     * @return string
     * function
     * =>returns the name of media files that are present locally in the system
     */
    app.get('/getMedia', function (req, res) {
        var data = fs.readFileSync(__dirname + '/data/' + 'media_list.txt', 'utf8');
        //send array of media files name
        res.send(data.split(/\n/));
    });
   /**
     * @Route/api call
     * @name /getPin
     * @method GET
     * @return file
     * function
     * =>returns the 5 digit pincode from config_details.txt
     */
    app.get('/getPin', function (req, res) {
        var pin = fs.readFileSync(__dirname + '/data/config_details.txt', 'utf8').split('PIN=')[1].trim();
        res.end(pin);
    });
   /**
     * @Route/api call
     * @name /config
     * @method POST
     * @return string
     * function
     * =>overwrites config_details.html with new Pin & url code
     */
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