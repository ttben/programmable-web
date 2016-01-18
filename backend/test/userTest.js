var assert = require('assert');

var user = require('../models/User');
var mongoose = require("mongoose");



suite('User tests', function () {

    suiteSetup(function() {
        var db_url = "mongodb://localhost/testUser";
        mongoose.connect(db_url);
    });

    setup(function () {
        user.remove({}, function (err) {
            console.log('collection removed\n');
        });
    });

    suite('Sign up test', function () {
        var email = "anEmail";
        var pwd = "pwd";
        var role = "admin";

        test('Should create user in db if does not exist', function (done) {
            user.signUp(email, pwd, role, function (res) {
                assert.equal(email, res.email);
                assert.equal(pwd, res.password);
                assert.equal(role, res.role);

                done();

            });
        });

        test('Should throw userAlreadyExists if already exists in db', function (done) {
            user.signUp(email, pwd, role, function (res) {
                user.signUp(email, pwd, role, null, null, null, function () {

                    done();

                })
            });
        });

        test('Should throw badRequest if sign up request is malformed - role unrecognized', function (done) {
            user.signUp("anotherEmail", "anotherPWD", "a role that does not exist", null, null, function () {
                done();
            });
        });

    });

    suite('checkUserExistsByToken test', function () {
        var email = "anEmail";
        var pwd = "pwd";
        var role = "admin";

        test('should return user if he exists', function (done) {
            user.signUp(email, pwd, role, function (res) {

                user.checkUserExistsByToken(res._id, function (user) {

                    assert.equal(res._id.toString(), user._id.toString());
                    assert.equal(email, user.email);
                    assert.equal(pwd, user.password);
                    assert.equal(role, user.role);

                    done();
                });
            });
        });

        test('should return not found if given token does not exist', function (done) {
            var aFakeID = "56976e9690c05d9311c9da70";
            user.checkUserExistsByToken(aFakeID, null, null, function () {
                done();
            });
        });

        test('should fail if given token is not a proper one', function (done) {
            var aFakeID = "alol";
            user.checkUserExistsByToken(aFakeID, null, function () {
                done();
            });
        });
    });

    suite('Authenticate user', function () {
        var email = "anEmail";
        var pwd = "pwd";
        var role = "admin";

        test('should return user token if he exists', function (done) {
            user.signUp(email, pwd, role, function (res) {

                var token = res._id;

                user.authenticate(email, pwd, function (user) {
                    assert.equal(token.toString(), user._id.toString());
                    done();
                });
            });
        });

        test('should return notFound if credentials provided are incorrect', function (done) {
            user.signUp(email, pwd, role, function (res) {

                var token = res._id;

                user.authenticate(email+"salt", pwd, null,null,function (user) {
                    done();
                });
            });
        });
    });

    suiteTeardown(function () {
        mongoose.disconnect();
    });
});

