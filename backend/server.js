var fs = require("fs");
var express = require('express');
var morgan = require("morgan");
var bodyParser = require("body-parser");
var usersLog = require("./our_modules/loggers").get('usersLog');

//  Routes
var root = require('./routes/root');
var comments = require('./routes/comments');
var songs = require('./routes/songs');
var mixes = require('./routes/mixes');

var port = process.env.PORT || 3001;
var dbConfiguration = require('./db_configuration');

var app = express();

app.use(express.static(__dirname + '/'));
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use(setUpHeaders);
app.use(morgan("dev"));

/****************************
 * ROUTES
 ****************************/

app.use('/', root);
app.use('/comments', comments);
app.use('/songs', songs);
app.use('/mixes', mixes);

// Start Server
app.listen(port, function () {
    console.log("Express server listening on port " + port);
});

function setUpHeaders(req, res, next) {
        res.header("Access-Control-Allow-Origin", "*");
        res.header("Access-Control-Allow-Methods", "POST, GET, xPUT, DELETE, OPTIONS");
        res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
        if ('OPTIONS' == req.method) {
            res.send(200);
        }
        else {
            next();

    }
}




/****************************
 * LE TRUC DU PROF
 ****************************/

/*
 // Config
 var PORT = 8081,
 TRACKS_PATH = './multitrack/';
 // launch the http server on given port
 server.listen(PORT);
 console.log("Server listening on ", PORT, "...");

 // routing
 app.get('/', function (req, res) {
 res.sendfile(__dirname + '/index.html');
 });
 */

// routing
app.get('/track', function (req, res) {
    function sendTracks(trackList) {
        if (!trackList)
            return res.send(404, 'No track found');
        res.writeHead(200, {'Content-Type': 'application/json'});
        res.write(JSON.stringify(trackList));
        res.end();
    }

    getTracks(sendTracks);
});

// routing
app.get('/track/:id', function (req, res) {
    var id = req.params.id;

    function sendTrack(track) {
        if (!track)
            return res.send(404, 'Track not found with id "' + id + '"');
        res.writeHead(200, {'Content-Type': 'application/json'});
        res.write(JSON.stringify(track));
        res.end();
    }

    getTrack(id, sendTrack);

});

// routing
app.get(/\/track\/(\w+)\/(?:sound|visualisation)\/((\w|.)+)/, function (req, res) {
    res.sendfile(__dirname + '/' + TRACKS_PATH + req.params[0] + '/' + req.params[1]);
});

function getTracks(callback) {
    getFiles(TRACKS_PATH, callback);
}

function getTrack(id, callback) {
    getFiles(TRACKS_PATH + id, function (fileNames) {
        var track = {
            id: id,
            instruments: []
        };
        fileNames.sort();
        for (var i = 0; i < fileNames.length; i += 2) {
            var instrument = fileNames[i].match(/(.*)\.[^.]+$/, '')[1];
            track.instruments.push({
                name: instrument,
                sound: instrument + '.mp3',
                visualisation: instrument + '.png'
            });
        }
        callback(track);
    })
}

function getFiles(dirName, callback) {
    fs.readdir(dirName, function (error, directoryObject) {
        callback(directoryObject);
    });
}

