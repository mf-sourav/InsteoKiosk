/**
 * File-routes.js
 * Date Modified = 8/8/18
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

    //path variables
    const mediaListPath = "/data/media_list.txt";
    const configDetailsPath = "/data/config_details.json";
    const publicFolderPath = '../public';
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
            root: path.join(__dirname, publicFolderPath)
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
            root: path.join(__dirname, publicFolderPath)
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
            //checks if media file is present
            try {
                if (!fs.existsSync(__dirname + 'server/media/' + getFileName(urlArray[i]))) {
                    //if not present download the content synchronously
                    download(urlArray[i], 'server/media').then(() => {
                        //after downloading write files to media_list file
                        fs.appendFileSync(__dirname + mediaListPath, getFileName(urlArray[i]) + "\r\n");
                    });
                }
            } catch (error) {
                res.end(error);
            }
        }
        res.sendFile('player.html', {
            root: path.join(__dirname, publicFolderPath)
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
        fs.readFile(__dirname + "/data/type.txt", 'utf8', function (err, data) {
            if(err){
                res.end(err);
            }
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
        fs.readFile(__dirname + configDetailsPath, 'utf8', function (err, data) {
            if (err) {
                res.end(err);
            }
            var obj = JSON.parse(data);
            res.end(obj.URL);
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
        try {
            var data = fs.readFileSync(__dirname + mediaListPath, 'utf8');
            //send array of media files name
            res.send(data.split(/\n/));
        } catch (error) {
            res.end(error);
        }
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
        fs.readFile(__dirname + configDetailsPath, 'utf8', function (err, data) {
            if (err) {
                res.end(err);
            }
            console.log(data);
            var obj = JSON.parse(data);
            res.end(pinDecode(obj.PIN));
        });
    });
    /**
     * @Route/api call
     * @name /config
     * @method POST
     * @return string
     * function
     * =>overwrites config_details.json with new Pin & url code
     */
    app.post('/setPinPassword', function (req, res) {
        var conf = {
            URL: req.body.url,
            PIN: pinEncode(req.body.pin)
        };
        fs.writeFile(__dirname + configDetailsPath, JSON.stringify(conf), 'utf8', function (err) {
            if (err) {
                res.end("error");
            } else {
                res.end("success");
            }
        });
    });

    function pinEncode(pin){
        return Buffer.from(pin).toString('base64');
    }

    function pinDecode(pin){
        return Buffer.from(pin, 'base64').toString('ascii');
    }
}