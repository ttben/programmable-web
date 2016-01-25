var assert = require('assert');

var mix = require('../models/Mix');
var song = require('../models/Song');
var user = require('../models/User');
var mongoose = require("mongoose");

var db_url = "mongodb://localhost/testMix";
mongoose.connect(db_url);
    var songId;
suite('Mix tests', function () {

    var song2 = new song(
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
                  "name": "guirate 2",
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




    setup(function (done) {
        var callsNeeded = 3;

        mix.remove({}, function (err) {
            console.log('mix collection removed\n');
            if(--callsNeeded == 0) {
                done();
            }
        });

        song.remove({}, function (err) {
            console.log('song collection removed\n');
            song2.save(function (err, songRes) {
                if (err) {
                    console.log("Impossible to store stub song");
                }
                else {
                    console.log("Stub song stored !");
                    songId = songRes._id;
                    if(--callsNeeded == 0) {
                       done();
                    }
                }
            });
        });

        user.remove({}, function (err) {
            console.log('user collection removed\n');
            if(--callsNeeded == 0) {
                done();
            }
        });

    });

    suite('add mix to song', function () {

        test('Should return the mix added', function (done) {

            var newMix = new mix({
                authorId: "authorId",
                author: "author",
                musicId: songId,
                mixName: "mixName",
                tracks: "tracks"
            });


            mix.storeMix(
                newMix,
                function(mixResult) {
                    // assert.equal("unid", mixResult._id);
                    assert.equal("authorId", mixResult.authorId);
                    assert.equal("author", mixResult.author);
                    assert.equal(songId, mixResult.musicId);
                    assert.equal("mixName", mixResult.mixName);
                    assert.equal("tracks", mixResult.tracks);
                    // assert.equal("", mixResult.comments);
                    // assert.equal("", mixResult.date);
                    done();
                }
            );
        });

        test('Should throw not foud error if given song can not be found', function (done) {

            var newMix2 = new mix({
                authorId: "authorId",
                author: "author",
                musicId: "aSongIdThatDoesNotExist",
                mixName: "mixName",
                tracks: "tracks"
            });

            mix.storeMix(
                newMix2,null, null, function() {
                    done();
                }
            );
            
        });
    });
    
    suite('get mixes from song', function () {

        test('Should return a mix from an Id', function (done) {

            // // var randNum = Math.floor((Math.random() * 1000) + 1);
            // // var newMix3 = new mix({
            // //     authorId: "authorId"+randNum,
            // //     author: "author"+randNum,
            // //     musicId: songId,
            // //     mixName: "mixName"+randNum,
            // //     tracks: "tracks"+randNum
            // // });

            // // mix.storeMix(
            //     newMix3, function(mixResult) {

            //         mix.getMixById(
            //             mixResult._id, function(theMix) {
            //                 // assert.equal("unid", theMix._id);
            //                 assert.equal("authorId"+randNum, theMix.authorId);
            //                 assert.equal("author"+randNum, theMix.author);
            //                 assert.equal(songId, theMix.musicId);
            //                 assert.equal("mixName"+randNum, theMix.mixName);
            //                 assert.equal("tracks"+randNum, theMix.tracks);
            //                 // assert.equal("", theMix.comments);
            //                 // assert.equal("", theMix.date);
                            done();
            //             }
            //         );

            //     }
            // );
        });

        test('Should return the mixes from a song Id', function (done) {

            var authorId = "56976e9690c05d9311c9da70"

            // var randNum0 = Math.floor((Math.random() * 1000) + 1);
            // var newMix10 = new mix({
            //     authorId: "authorId",
            //     author: "author"+randNum0,
            //     musicId: songId,
            //     mixName: "mixName"+randNum0,
            //     tracks: "tracks"+randNum0
            // });
            // var randNum1 = Math.floor((Math.random() * 1000) + 1);
            // var newMix11 = new mix({
            //     authorId: authorId,
            //     author: "author"+randNum1,
            //     musicId: songId,
            //     mixName: "mixName"+randNum1,
            //     tracks: "tracks"+randNum1
            // });

            // mix.storeMix(
            //     newMix10, function(mixResult1) {
            //         mix.storeMix(
            //             newMix11, function(mixResult2) {

                            mix.getMixesByUserId(
                                authorId, function(mixes) {
                                    assert.equal(0, mixes.length);
                                    // assert.equal(mixResult2._id, mixes[0]._id);
                                    // assert.equal(authorId, mixes[0].authorId);
                                    // assert.equal("author"+randNum1, mixes[0].author);
                                    // assert.equal(songId, mixes[0].musicId);
                                    // assert.equal("mixName"+randNum1, mixes[0].mixName);
                                    // assert.equal("tracks"+randNum1, mixes[0].tracks);
                                    // assert.equal("", mixes[0].comments);
                                    // assert.equal("", mixes[0].date);
                                    done();
                                }
                            );

            //             }
            //         );
            //     }
            // );

        });

    });


    suiteTeardown(function () {
        mongoose.disconnect();
    });
});
