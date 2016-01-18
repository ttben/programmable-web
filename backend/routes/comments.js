
var express = require('express');
var router = express.Router();

var Comment = require('../models/Comment');


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
    var mixID = req.query.mixID;

    // Comment.find({mix_id: req.query.mixID}, function (err, comments) {
    Comment.find({mix_id: req.query.mixID}, {'__v': 0}).lean().exec(function (err, comments) {
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
    var mixID = req.query.mixID;

    var comment = new Comment({
      "mix_id": req.body.mix_id,
      "authorName": req.body.authorName,
      "text": req.body.text,
      "date": req.body.date
    });
    comment.save(function (err, commentRes) {
        if (err) {
            res.status(500).send("Internal error buddy. Sorry." + err);
        }
        else {
            res.status(200).send(commentRes);
        }
    });

});

module.exports = router;