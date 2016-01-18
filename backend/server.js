var fs = require("fs");
var express = require('express');
var morgan = require("morgan");
var bodyParser = require("body-parser");
var mongoose = require("mongoose");

var usersLog = require("./our_modules/loggers").get('usersLog');

//  Routes
var root = require('./routes/root');
var comments = require('./routes/comments');
var songs = require('./routes/songs');

//  Models
var Song = require('./models/Song');
var Comment = require('./models/Comment');
var User = require('./models/User');

var port = process.env.PORT || 3001;

// Init globals variables for each module required
var app = express();

// Indicate where static files are located
app.use(express.static(__dirname + '/'));

var db_url = process.env.MONGO_URL || "mongodb://localhost/test";

console.log("ENV MONGO_URL", process.env.MONGO_URL);
console.log("Connecting to db with", db_url);

mongoose.connect(db_url);

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
 * DB
 ****************************/

var db = mongoose.connection;

db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function () {
    // we're connected!
    console.log("Connected to DB");

    console.log("Flushing songs collection ...");
    Song.find().remove().exec();

    var song = new Song(
        {
            url: 'http://localhost:3001/songs/1/',
            title: "Lolipop in your life",
            artist: "Moi",
            tracks: [
                {
                    name: "moi", uri: "moi.mp3"
                },
                {
                    name: "toujours moi", uri: "toujoursMoi.mp3"
                }
            ],
            mixes: []
        });
    song.addMix({mix: "oui", settings: "toujours oui"});
    song.save(function (err, songRes) {
        if (err) {
            console.log("Impossible to store stub song");
        }
        else {
            console.log("Stub song stored !");
        }
    });


    console.log("Flushing user collection ...");
    User.find().remove().exec();

    var user = new User({email: "pw@pw.com", password: "yes", role: "admin"});
    user.save(function (err, userRes) {
        if (err) {
            console.log("Impossible to store stub user");
        }
        else {
            console.log("Stub user stored !");
        }
    });

    var comment = new Comment({
      "mix_id": "1",
      "authorName": "jean poele",
      "text": "TROP COOL",
      "date": "12334567"
    });
    comment.save(function (err, commentRes) {
        if (err) {
            console.log("Impossible to store comment");
        }
        else {
            console.log("comment stored !");
        }
    });
});



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

