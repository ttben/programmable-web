var express = require('express');
var router = express.Router();

var Mix = require('../models/Mix');
var Song = require('../models/Song')

router.use(function (req, res, next) {
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

router.post('/', function (req, res) {
    var authorId = req.body.authorId;
    var author = req.body.author;
    var musicId = req.body.musicId;
    var mixName = req.body.mixName;
    var tracks = req.body.tracks;
    // var comments = req.body.comments;
    // var rating = req.body.rating;


    if (authorId == null || authorId == undefined) {
        res.status(400).send("Please check that you are sending authorId field. I didn't find it. Thanks!");
        return;
    }

    if (author == null || author == undefined) {
        res.status(400).send("Please check that you are sending author field. I didn't find it. Thanks!");
        return;
    }

    if (musicId == null || musicId == undefined) {
        res.status(400).send("Please check that you are sending musicId field. I didn't find it. Thanks!");
        return;
    }

    if (mixName == null || mixName == undefined) {
        res.status(400).send("Please check that you are sending mixName field. I didn't find it. Thanks!");
        return;
    }

    if (tracks == null || tracks == undefined) {
        res.status(400).send("Please check that you are sending tracks field. I didn't find it. Thanks!");
        return;
    }

    var mix = new Mix({
        authorId: authorId,
        author: author,
        musicId: musicId,
        mixName: mixName,
        tracks: tracks
    });

    mix.save(function (err, mixResult) {
        if (err) {
            res.status(500).send("Internal error buddy. Sorry. " + err);
            return;
        }

        //  Get the base song
        Song.findOne({'_id': musicId}, function (err, song) {

            if (err) {
                console.error(err);

                res.status(404).send("Can not find specified song with given Id : " + musicId);
                return;

            }
            console.log(song.prototype);

            song.addMix(mixResult);

            song.save(function (err, songResult) {
                console.log(songResult);
                if (err) {
                    res.status(500).send("Oups " + err);
                } else {
                    res.status(200).send(mixResult);
                }
            });

        });
    });


});

router.get('/:mixId', function (req, res) {
    Mix.find({_id: req.params.mixId}, {'__v': 0}).lean().exec(function (err, mix) {
        if (err) {
            res.json({
                type: false,
                data: "Error occured: " + err
            });
        } else {
            res.send(mix[0] || {});
        }
    });
});

router.get('/', function (req, res) {

    var filter = {};
    if (req.query.userId != undefined && req.query.userId != null) {
        filter.authorId = req.query.userId;
    }

    Mix.find(filter, {'__v': 0}).lean().exec(function (err, mixes) {
        if (err) {
            res.json({
                type: false,
                data: "Error occured: " + err
            });
        } else {
            res.send(mixes || []);
        }
    });
});

module.exports = router;