var fs = require("fs");
// We need to use the express framework: have a real web server that knows how to send mime types etc.
var express = require('express');

var morgan = require("morgan");
var bodyParser = require("body-parser");
var jwt = require("jsonwebtoken");
var mongoose = require("mongoose");

var usersLog = require("./our_modules/loggers").get('usersLog');

// Init globals variables for each module required
var app = express();

// Indicate where static files are located
app.configure(function () {
    app.use(express.static(__dirname + '/'));
});

var port = process.env.PORT || 3001;
var User = require('./models/User');
var Song = require('./models/Song');
var Comment = require('./models/Comment');


var db_url = process.env.MONGO_URL || "mongodb://localhost/test";

console.log("ENV MONGO_URL", process.env.MONGO_URL);
console.log("Connecting to db with", db_url);

mongoose.connect(db_url);

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "POST, GET, xPUT, DELETE, OPTIONS");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
    if ('OPTIONS' == req.method) {
        res.send(200);
    }
    else {
        next();
    }
});
app.use(morgan("dev"));


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

app.get('/songs', function (req, res) {
    var token = req.query.token;

    Song.getListOfSongsForUserByToken(
        token,
        function(songsList) {
            res.status(200).send(songsList);
        },
        function(err) {
            res.status(500).send(err);
        },
        function(user, errDesc) {
            res.status(401).send(errDesc);
        },
        function() {
            res.status(404).send("User with token " + token + " can not be found");
        }
    );
});

app.get('/', function (req, res) {

    res.status(200).send("lol mabite");
});

app.post('/authenticate', function (req, res) {

    var email = req.body.email;
    var password = req.body.password;

    User.authenticate(
        email,
        password,
        function(user) {
            res.status(200).send({
                email: user.email,
                token: user._id
            });
        },
        function(err) {
            res.status(500).send({
                type: false,
                data: "Error occured: " + err
            });
        },
        function(err) {
            res.status(400).send({
                type: false,
                data: err
            });
        }
    );
});

app.post('/signup', function (req, res) {


    User.signUp(req.body.email, req.body.password, req.body.role,
        function(user) {
            res.status(201).send({token: user._id});
        },
        function(err) {
            res.status(500).send({
                type: false,
                data: "Error occured: " + err
            });
        },
        function(err) {
                // bad request
                res.status(400).send(err);
        },
        function() {
            // already exists
            res.status(403).send({
                type: false,
                data: "User already exists!"
            });
        }
    );
});

// Start Server
app.listen(port, function () {
    console.log("Express server listening on port " + port);
});

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





/*
 * comments
 */





app.get('/comments', function (req, res) {
    var mixID = req.query.mixID;

    // Comment.find({mix_id: req.query.mixID}, function (err, comments) {
    Comment.find({mix_id: req.query.mixID}, {'__v': 0}).lean().exec(function (err, comments) {
        if (err) {
            res.json({
                type: false,
                data: "Error occured: " + err
            });
        } else {
            res.json({
                comments: comments || []
            });
        }
    });
});

app.post('/comments', function (req, res) {
    var mixID = req.query.mixID;

    var comment = new Comment({
      "mix_id": res.mix_id,
      "authorName": res.authorName,
      "text": res.text,
      "date": res.date
    });
    comment.save(function (err, commentRes) {
        if (err) {
            res.status(500).send("Internal error buddy. Sorry." + err);
        }
        else {
            res.status(200).send(commentRes);
        }
    });

});
