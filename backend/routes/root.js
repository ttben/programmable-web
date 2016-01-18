
var express = require('express');
var router = express.Router();

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


router.get('/', function (req, res) {

    res.status(200).send("lol mabite");
});

router.post('/authenticate', function (req, res) {

    var email = req.body.email;
    var password = req.body.password;

    User.authenticate(
        email,
        password,
        function(user) {
            res.status(200).send({
                email: user.email,
                token: user._id
            });
        },
        function(err) {
            res.status(500).send({
                type: false,
                data: "Error occured: " + err
            });
        },
        function(err) {
            res.status(400).send({
                type: false,
                data: err
            });
        }
    );
});

router.post('/signup', function (req, res) {

    User.signUp(req.body.email, req.body.password, req.body.role,
        function(user) {
            res.status(201).send({token: user._id});
        },
        function(err) {
            res.status(500).send({
                type: false,
                data: "Error occured: " + err
            });
        },
        function(err) {
                // bad request
                res.status(400).send(err);
        },
        function() {
            // already exists
            res.status(403).send({
                type: false,
                data: "User already exists!"
            });
        }
    );
});


module.exports = router;