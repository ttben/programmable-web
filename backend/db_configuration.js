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


    Comment.find().remove().exec();
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

    Mix.find().remove().exec();
});

module.exports = db;