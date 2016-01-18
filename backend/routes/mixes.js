var express = require('express');
var router = express.Router();

var Mix = require('../models/Mix');


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

router.post('/', function(req,res) {
    var authorID = req.body.authorID;
    var originalTitle = req.body.originalTitle;
    var originalArtist = req.body.originalArtist;
    var date = req.body.date;
    var tracks = req.body.tracks;

    var mix = new Mix({
        authorID:authorID,
        originalTitle:originalTitle,
        originalArtist:originalArtist,
        date:date,
        tracks:tracks
    });

    mix.save(function (err, mixResult) {
        if (err) {
            res.status(500).send("Internal error buddy. Sorry." + err);
        }
        else {
            res.status(200).send(mixResult);
        }
    });

});


/*
router.get('/', function (req, res) {
    var token = req.query.token;

    Song.getListOfSongsForUserByToken(
        token,
        function(songsList) {
            res.status(200).send(songsList);
        },
        function(err) {
            res.status(500).send(err);
        },
        function(user, errDesc) {
            res.status(401).send(errDesc);
        },
        function() {
            res.status(404).send("User with token " + token + " can not be found");
        }
    );
});
*/

module.exports = router;