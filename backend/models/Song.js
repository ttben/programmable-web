var mongoose     = require('mongoose');
var Schema = mongoose.Schema;

var SongSchema   = new Schema({
    url:String,
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
        function (songsList) {
            getListOfSongsForUser(songsList, successFunction, failFunction, unauthorizedUserFunction);
        },
        failFunction,
        notFoundUserFunction
    );
};

var getListOfSongsForUser = function(user, successFunction, failFunction, unauthorizedUserFunction) {
    console.log("THE USER HAS ROLE", user.role);
    if (user.role == "public") {
        unauthorizedUserFunction(user,"sorry, public can not get the songs bitch");
        return;
    }

    //	Find all songs, delete '__v' attribute,
    //	make the result a plain JS object and exec given function
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





Song.getListOfSongsForUserByToken = getListOfSongsForUserByToken;
Song.getListOfSongsForUser = getListOfSongsForUser;

module.exports =  Song;