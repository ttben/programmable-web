var assert = require('assert');

var song = require('../models/Song');
var user = require('../models/User');
var mongoose = require("mongoose");

var db_url = "mongodb://localhost/testSong";
mongoose.connect(db_url);

suite('Song tests', function () {
    setup(function () {
        song.remove({}, function (err) {
            console.log('collection removed\n');
        });

        user.remove({}, function (err) {
            console.log('collection removed\n');
        });
    });

    suite('Get list of songs for user', function () {
        var email = "anEmail";
        var pwd = "pwd";
        var role = "admin";

        test('Should returns list of song if user is admin', function (done) {
            user.signUp(email, pwd, role, function (res) {
                song.getListOfSongsForUser(res, function(data) {
                    done();
                });
            });
        });

        test('Should returns list of song if user is admin', function (done) {
            role = "public";

            user.signUp(email, pwd, role, function (res) {
                song.getListOfSongsForUser(res,null, null, function(res, err) {
                    done();
                });
            });
        });

    });


    suiteTeardown(function () {
        mongoose.disconnect();
    });
});

