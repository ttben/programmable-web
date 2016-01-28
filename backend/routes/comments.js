
var express = require('express');
var router = express.Router();

var Comment = require('../models/Comment');
var Mix = require('../models/Mix');
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
    var token = req.query.token;

    if(token == null || token == undefined) {
        res.status(401).send("Token not specified. Please gimme dat token");
        return;
    }

    var postComment = function() {

        var mixId = req.body.mixId,
            authorName = req.body.authorName,
            text = req.body.text;

        console.log("mixId", mixId, "authorName", authorName, "text", text);

        var comment = new Comment({
            mixId: mixId,
            authorName: authorName,
            text: text
        });

        Mix.getMixById(
            mixId,
            function (mix) {

                mix.addComment(comment);

                comment.save(function (err, commentResult) {
                    mix.save(function (err, mixResult) {
                        if (err) {
                            res.status(500).send("Internal error buddy. Sorry. " + err);
                            return;
                        } else {
                            res.status(200).send(commentResult);
                            return;
                        }
                    });
                });
            },
            function (err) {
                res.status(500).send("Internal error buddy. Sorry. " + err);
            },
            function (mixId) {
                res.status(404).send("mixId can not be found buddy. Sorry ! " + mixId);
            }
        )
    }

    User.checkUserExistsByToken(
        token,
        function (user) {
            if (user.role == 'public') {
                res.status(403).send("User " + user + " is not allowed to add comment dude");
                return;
            }

            postComment();
        },
        function (err) {
            res.status(500).send(err);
        }, function () {
            res.status(404).send("Given token was not found");
        });

});

module.exports = router;