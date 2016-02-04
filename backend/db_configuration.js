//  Models
var Song = require('./models/Song');
var Comment = require('./models/Comment');
var User = require('./models/User');
var Mix = require('./models/Mix');

var mongoose = require("mongoose");


/****************************
 * DB
 ****************************/

var db_url = process.env.MONGO_URL || "mongodb://localhost/test";

console.log("ENV MONGO_URL", process.env.MONGO_URL);
console.log("Connecting to db with", db_url);

mongoose.connect(db_url);

var db = mongoose.connection;

db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function () {
    // we're connected!
    console.log("Connected to DB");

    console.log("Flushing songs collection ...");
    Song.find().remove().exec();

    var song2 = new Song(
        {
            uri: "music/queen_champions",
            image: 'image/queen_champions.jpg',
            title: "We are the Champions",
            artist: "Queen",
            tracks: [
                {
                  "name": "basse",
                  "uri": "basse.mp3"
                },
                {
                  "name": "batterie",
                  "uri": "batterie.mp3"
                },
                {
                  "name": "guitare",
                  "uri": "guitare.mp3"
                },
                {
                  "name": "guitare 2",
                  "uri": "guitare2.mp3"
                },
                {
                  "name": "voix",
                  "uri": "voix.mp3"
                },
                {
                  "name": "piano",
                  "uri": "piano.mp3"
                }
            ],
            mixes: []
        });

    song2.save(function (err, songRes) {
        if (err) {
            console.log("Impossible to store stub song");
        }
        else {
            console.log("Stub song stored !");
        }
    });


    var song3 = new Song(
        {
            uri: "music/zwiepack_summertime",
            image: 'image/zwiepack_summertime.jpg',
            title: "Zwiepack Summertime",
            artist: "Zwiepack",
            tracks: [
                {
                  "name": "Voix",
                  "uri": "voix.mp3"
                }
            ],
            mixes: []
        });

    song3.save(function (err, songRes) {
        if (err) {
            console.log("Impossible to store stub song");
        }
        else {
            console.log("Stub song stored !");
        }
    });

    var song1 = new Song(
        {
            uri: "music/amy_rehab",
            image: 'image/amy_rehab.jpg',
            title: "Rehab",
            artist: "Amy Winehouse",
            tracks: [
                {
                    "name": "basse",
                    "uri": "basse.mp3"
                },
                {
                    "name": "batterie",
                    "uri": "batterie.mp3"
                },
                {
                    "name": "guitare",
                    "uri": "guitare.mp3"
                },
                {
                    "name": "cuivres",
                    "uri": "cuivres.mp3"
                },
                {
                    "name": "voix",
                    "uri": "voix.mp3"
                },
                {
                    "name": "piano",
                    "uri": "piano.mp3"
                },
                {
                    "name": "orgue",
                    "uri": "orgue.mp3"
                }
            ],
            mixes: []
        });

    song1.save(function (err, songRes) {
        if (err) {
            console.log("Impossible to store stub song");
        }
        else {
            console.log("Stub song stored !");
        }
    });

    var song4 = new Song(
        {
            uri: "music/bob_love",
            image: 'image/bob_love.jpg',
            title: "One Love",
            artist: "Bob Marley",
            tracks: [
                {
                    "name": "basse",
                    "uri": "basse.mp3"
                },
                {
                    "name": "choeurs 1",
                    "uri": "choeurs1.mp3"
                },
                {
                    "name": "choeurs 2",
                    "uri": "choeurs2.mp3"
                },
                {
                    "name": "extra",
                    "uri": "extra.mp3"
                },
                {
                    "name": "guitare 1",
                    "uri": "guitare1.mp3"
                },
                {
                    "name": "guitare 2",
                    "uri": "guitare2.mp3"
                },
                {
                    "name": "guitare 3",
                    "uri": "guitare3.mp3"
                },
                {
                    "name": "Oooh",
                    "uri": "oooh.mp3"
                },
                {
                    "name": "orgue",
                    "uri": "orgue.mp3"
                },
                {
                    "name": "piano",
                    "uri": "piano.mp3"
                },
                {
                    "name": "rythme",
                    "uri": "rythme.mp3"
                },
                {
                    "name": "saxophone",
                    "uri": "saxo.mp3"
                },
                {
                    "name": "trombone",
                    "uri": "trombone.mp3"
                },
                {
                    "name": "trompette",
                    "uri": "trompette.mp3"
                },
                {
                    "name": "voix",
                    "uri": "voix.mp3"
                }
            ],
            mixes: []
        });

    song4.save(function (err, songRes) {
        if (err) {
            console.log("Impossible to store stub song");
        }
        else {
            console.log("Stub song stored !");
        }
    });

    var song5 = new Song(
        {
            uri: "music/jamesbrown_get",
            image: 'image/jamesbrown_get.jpg',
            title: "Get on the good foot",
            artist: "James Brown",
            tracks: [
                {
                    "name": "basse",
                    "uri": "basse.mp3"
                },
                {
                    "name": "extra",
                    "uri": "extra.mp3"
                },
                {
                    "name": "guitare",
                    "uri": "guitare.mp3"
                },
                {
                    "name": "voix",
                    "uri": "voix.mp3"
                },
                {
                    "name": "batterie",
                    "uri": "batterie.mp3"
                }
            ],
            mixes: []
        });

    song5.save(function (err, songRes) {
        if (err) {
            console.log("Impossible to store stub song");
        }
        else {
            console.log("Stub song stored !");
        }
    });

    var song6 = new Song(
        {
            uri: "music/deep_smoke",
            image: 'image/deep_smoke.jpg',
            title: "Smoke on the water",
            artist: "Deep purple",
            tracks: [
                {
                    "name": "basse",
                    "uri": "basse.mp3"
                },
                {
                    "name": "guitare",
                    "uri": "guitare.mp3"
                },
                {
                    "name": "voix",
                    "uri": "voix.mp3"
                },
                {
                    "name": "batterie",
                    "uri": "batterie.mp3"
                }
            ],
            mixes: []
        });

    song6.save(function (err, songRes) {
        if (err) {
            console.log("Impossible to store stub song");
        }
        else {
            console.log("Stub song stored !");
        }
    });

    console.log("Flushing user collection ...");
    User.find().remove().exec();


    Comment.find().remove().exec();

    Mix.find().remove().exec();
});

module.exports = db;