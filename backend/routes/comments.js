
var express = require('express');
var router = express.Router();

var Comment = require('../models/Comment');
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

/*
 * comments
 */

router.get('/', function (req, res) {
    var mixId = req.query.mixId;

    // Comment.find({mixId: req.query.mixId}, function (err, comments) {
    Comment.find({mixId: req.query.mixId}, {'__v': 0}).lean().exec(function (err, comments) {
        if (err) {
            res.json({
                type: false,
                data: "Error occured: " + err
            });
        } else {
            res.json({
                comments: comments || []
            });
        }
    });
});

router.post('/', function (req, res) {
    var mixId = req.body.mixId,
        authorName =  req.body.authorName,
        text = req.body.text,
        date =req.body.date;

    console.log("mixId", mixId, "authorName", authorName, "text", text, "date", date);

    var comment = new Comment({
      mixId: mixId,
      authorName: authorName,
      text: text,
      date: date
    });

    Mix.getMixById(
        mixId,
        function(mix) {

            mix.addComment(comment);

            Mix.storeMix(
                mix,
                function(mixResult) {
                    comment.save(function (err, commentRes) {
                        if (err) {
                            res.status(500).send("Internal error buddy. Sorry." + err);
                        }
                        else {
                            res.status(200).send(commentRes);
                        }
                    });
                },
                function(err) {
                    res.status(500).send("Internal error buddy. Sorry. " + err);
                },
                function() {
                    res.status(404).send("Can not find specified song with given Id : " + req.params.mixId);
                }
            );


        },
        function(err) {
            res.status(500).send("Internal error buddy. Sorry. " + err);
        },
        function(mixId) {
            res.status(404).send("mixId can not be found buddy. Sorry ! " + mixId);
        }
    )



});

module.exports = router;