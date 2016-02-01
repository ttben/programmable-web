var express = require('express');
var router = express.Router();

var Mix = require('../models/Mix');
var Song = require('../models/Song');
var User = require('../models/User');

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
    var token = req.query.token;

    if(token == null || token == undefined) {
        res.status(401).send("Token required please. Gimme that parameter please");
        return;
    }

    var postMix = function() {

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
            tracks: tracks,
            nbRating: 0,
            cumulRating: 0,
            rating: 0
        });

        Mix.storeMix(
            mix,
            function (mixResult) {
                res.status(200).send(mixResult);
            },
            function (err) {
                res.status(500).send("Internal error buddy. Sorry. " + err);
            },
            function () {
                res.status(404).send("Can not find specified song with given Id : " + musicId);
            }
        );
    };

    User.checkUserExistsByToken(
        token,
        function (user) {
            if (user.role == 'public' || user.role == 'user') {
                res.status(403).send("User " + user + " is not allowed to add mixes");
                return;
            }

            postMix();
        },
        function (err) {
            res.status(500).send(err);
        }, function () {
            res.status(404).send("Given token was not found");
        });

});

router.get('/:mixId', function (req, res) {

    var token = req.query.token;

    if (token == undefined || token == null) {
        res.status(403).send("You must specify userId duuuude ! Please gimme dat");
        return;
    }

    var getMixById = function() {
        Mix.getMixById(
            req.params.mixId,
            function (mix) {
                res.status(200).send(mix);
            },
            function (err) {
                res.status(500).send("Internal error buddy. Sorry. " + err);
            },
            function(mixID) {
                res.status(404).send("Can not find mix with specified id : " + mixID);
            }
        );
    };

    getMixById();
});

router.get('/', function (req, res) {

    if (req.query.userId == undefined || req.query.userId == null) {
        res.status(403).send("You must specify userId duuuude ! Please gimme dat");
        return;
    }

    var userId = req.query.userId;

    Mix.getMixesByUserId(
        userId,
        function (mixes) {
            res.status(200).send(mixes);
        },
        function (err) {
            res.status(500).send("Internal error buddy. Sorry. " + err);
        }
    );

});

router.post('/rating', function (req, res) {

    var token = req.query.token;

    if(token == null || token == undefined) {
        res.status(401).send("Token required please. Gimme that parameter please");
        return;
    }

    User.checkUserExistsByToken(
        token,
        function (user) {
            rateMix(user._id);
        },
        function (err) {
            res.status(500).send(err);
        }, function () {
            res.status(404).send("Given token was not found");
        }
    );


    var rateMix = function(authorId) {

        // var authorId = req.body.authorId;
        var rating = req.body.rating;
        var mixId = req.body.mixId;

        if (rating == null || rating == undefined) {
            res.status(400).send("Please check that you are sending rating field. I didn't find it. Thanks!");
            return;
        }

        if (mixId == null || mixId == undefined) {
            res.status(400).send("Please check that you are sending mixId field. I didn't find it. Thanks!");
            return;
        }

        Mix.rate(
            mixId,
            authorId,
            rating,
            function (mix) {
                res.status(200).send(mix);
            },
            function (err) {
                res.status(500).send("Internal error buddy. Sorry. " + err);
            },
            function(mixID) {
                res.status(404).send("Can not find mix with specified id : " + mixID);
            }

        );

    };


});






module.exports = router;