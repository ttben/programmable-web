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

    Mix.storeMix(
        mix,
        function(mixResult) {
            res.status(200).send(mixResult);
        },
        function(err) {
            res.status(500).send("Internal error buddy. Sorry. " + err);
        },
        function() {
            res.status(404).send("Can not find specified song with given Id : " + musicId);
        }
    );


});

router.get('/:mixId', function (req, res) {

    Mix.getMixById(
        req.params.mixId,
        function(mix) {
            res.status(200).send(mix);
        },
        function(err) {
            res.status(500).send("Internal error buddy. Sorry. " + err);
        }
    );

});

router.get('/', function (req, res) {

    if (req.query.userId == undefined || req.query.userId == null) {
        res.status(403).send("You must specify userId duuuude ! Please gimme dat");
        return;
    }

    var userId = req.query.userId;

    Mix.getMixesByUserId(
        userId,
        function(mixes) {
            res.status(200).send(mixes);
        },
        function(err) {
            res.status(500).send("Internal error buddy. Sorry. " + err);
        }
    );
    
});

module.exports = router;