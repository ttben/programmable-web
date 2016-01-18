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

    if(authorID == null || authorID == undefined) {
        res.status(400).send("Please check that you are sending authorID field. I didn't find it. Thanks!");
        return;
    }

    if(originalTitle == null || originalTitle == undefined) {
        res.status(400).send("Please check that you are sending originalTitle field. I didn't find it. Thanks!");
        return;
    }

    if(originalArtist == null || originalArtist == undefined) {
        res.status(400).send("Please check that you are sending originalArtist field. I didn't find it. Thanks!");
        return;
    }

    if(date == null || date == undefined) {
        res.status(400).send("Please check that you are sending date field. I didn't find it. Thanks!");
        return;
    }

    if(tracks == null || tracks == undefined) {
        res.status(400).send("Please check that you are sending tracks field. I didn't find it. Thanks!");
        return;
    }

    var mix = new Mix({
        authorID:authorID,
        originalTitle:originalTitle,
        originalArtist:originalArtist,
        date:date,
        tracks:tracks
    });

    mix.save(function (err, mixResult) {
        if (err) {
            res.status(500).send("Internal error buddy. Sorry. " + err);
        }
        else {
            res.status(200).send(mixResult);
        }
    });

});

router.get('/:mixID', function(req, res) {
    Mix.find({_id: req.params.mixID}, {'__v': 0}).lean().exec(function (err, mix) {
        if (err) {
            res.json({
                type: false,
                data: "Error occured: " + err
            });
        } else {
            res.send(mix[0]||{});
        }
    });
});

router.get('/', function(req, res) {

    var filter = {};
    if(req.query.userID != undefined && req.query.userID !=  null) {
        filter.authorID=req.query.userID;
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