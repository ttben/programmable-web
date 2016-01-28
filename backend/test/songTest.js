var assert = require('assert');

var song = require('../models/Song');
var user = require('../models/User');
var mongoose = require("mongoose");



suite('Song tests', function () {
    suiteSetup(function() {
        var db_url = "mongodb://localhost/testSong";
        mongoose.connect(db_url);
    });

    setup(function (done) {
        var callsNeeded = 2;

        song.remove({}, function (err) {
            console.log('song collection removed\n');
            if(--callsNeeded == 0) {
                done();
            }
        });

        user.remove({}, function (err) {
            console.log('user collection removed\n');
            if(--callsNeeded== 0) {
                done();
            }
        });
    });

    suite('Get list of songs for user', function () {
        var email = "anEmail";
        var pwd = "pwd";
        var role = "admin";

        test('Should returns list of song if user is admin', function (done) {
            user.signUp(email, pwd, role, function (res) {
                song.getListOfSongsForUser(res, function (data) {
                    assert.equal(0, data.data.length);
                    assert.equal(data.token, res._id);
                    done();
                });
            });
        });
    });


    suiteTeardown(function () {
        mongoose.disconnect();
    });
});

