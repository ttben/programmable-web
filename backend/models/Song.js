var mongoose     = require('mongoose');
var Schema = mongoose.Schema;

var SongSchema   = new Schema({
    uri:String,
    image:String,
    title:String,
    artist:String,
    tracks:[],
    mixes:[]
});

SongSchema.methods.addMix = function(mixDocument) {
    this.mixes.push(mixDocument);
};

var Song = mongoose.model('Song', SongSchema);

var User = require('./User');

var getListOfSongsForUserByToken = function(token, successFunction, failFunction, unauthorizedUserFunction, notFoundUserFunction) {

    User.checkUserExistsByToken(
        token,
        function (user) {
            getListOfSongsForUser(user, successFunction, failFunction, unauthorizedUserFunction);
        },
        failFunction,
        notFoundUserFunction
    );
};

var getListOfSongsForUser = function(user, successFunction, failFunction, unauthorizedUserFunction) {

    if (user.role == "public") {
        unauthorizedUserFunction(user,"sorry, public can not get the songs bitch");
        return;
    }

    //  Find all songs, delete '__v' attribute,
    //  make the result a plain JS object and exec given function
    Song.find({}, {'__v': 0, tracks: 0, mixes: 0}).lean().exec(function (err, songs) {
        if (err) {
            console.error(err);
            failFunction(err);
        } else {
            var result = {};
            result.data = songs;
            result.token = user._id;
            successFunction(result);
        }
    })
};


var getSongByIdForUserByToken = function(token, songId, successFunction, failFunction, unauthorizedUserFunction, notFoundUserFunction) {

    User.checkUserExistsByToken(
        token,
        function (user) {
            getSongForUserById(user, songId, successFunction, failFunction, unauthorizedUserFunction);
        },
        failFunction,
        notFoundUserFunction
    );
};

var getSongForUserById = function(user, songId, successFunction, failFunction, unauthorizedUserFunction) {
    console.log("THE USER HAS ROLE", user.role);
    if (user.role == "public") {
        unauthorizedUserFunction(user,"sorry, public can not get the songs");
        return;
    }

    //	Find all songs, delete '__v' attribute,
    //	make the result a plain JS object and exec given function
    Song.findOne({'_id': songId}, {'__v': 0}).lean().exec(function (err, song) {
        if (err) {
            console.error(err);
            failFunction(err);
        } else {
            var result = {};
            result.data = song;
            result.token = user._id;
            successFunction(result);
        }
    })
};





Song.getListOfSongsForUserByToken = getListOfSongsForUserByToken;
Song.getListOfSongsForUser = getListOfSongsForUser;
Song.getSongByIdForUserByToken = getSongByIdForUserByToken;
Song.getSongForUserById = getSongForUserById;

module.exports =  Song;