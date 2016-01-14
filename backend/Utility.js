var User = require('./models/User.js');
var Song = require('./models/Song.js');
var usersLog = require("./our_modules/loggers").get('usersLog');

var signUp = function(email, password, role, successFunction, failFunction, badRequestFunction, alreadyExistsFunction) {
    User.findOne({email: email, password: password}, function (err, user) {
        if (err) {
            failFunction(err);
        } else {
            if (user) {
                alreadyExistsFunction();
            } else {
                var userModel = new User();
                userModel.email = email;
                userModel.password = password;
                userModel.role = role;

                if (userModel.role != "admin" && userModel.role != "user" && userModel.role != "public") {
                    badRequestFunction("Specified role " + userModel.role + " unrecognized");
                }

                userModel.save(function (err, user) {
                    if(err) {
                        failFunction(err);
                    } else {
                        successFunction(user);
                    }
                });
            }
        }
    });
};

var authenticateUser = function(email, password, successFunction, failFunction, incorrectInfoFunction) {
    User.findOne({email: email, password: password}, function (err, user) {
        if (err) {
            failFunction(err);
        } else {
            if (user) {
                usersLog.info('User connexion : ' + user.email, { email: user.email, token: user._id.toString()});
                successFunction(user);

            } else {
                incorrectInfoFunction("Incorrect information. Password or email incorrect");
            }
        }
    });
};

var getListOfSongsForUserByToken = function(token, successFunction, failFunction, unauthorizedUserFunction, notFoundUserFunction) {
    checkUserExistsByToken(
        token,
        function (songsList) {
            getListOfSongsForUser(songsList, successFunction, failFunction, unauthorizedUserFunction);
        },
        failFunction,
        notFoundUserFunction
    );
};

var getListOfSongsForUser = function(user, successFunction, failFunction, unauthorizedUserFunction) {
    console.log("THE USER HAS ROLE", user.role);
    if (user.role == "public") {
        unauthorizedUserFunction(user,"sorry, public can not get the songs bitch");
        return;
    }

    //	Find all songs, delete '__v' attribute,
    //	make the result a plain JS object and exec given function
    Song.find({}, {'__v': 0, tracks: 0, mixes: 0}).lean().exec(function (err, songs) {
        if (err) {
            console.error(err);
            failFunction(err);
        } else {
            var result = {};
            result.data = songs;
            result.token = user._id;
            successFunction(result);
        }
    })
};


var checkUserExistsByToken =  function(token, successFunction, failFunction, notFoundFunction) {
    console.log("Authenticate user with token", token);

    User.findOne({_id: token}, function (err, user) {
        if (err) {
            failFunction(err);
        } else {
            if (user) {
                successFunction(user);
            } else {
                notFoundFunction();
            }
        }
    })
};

exports.signUp = signUp;
exports.authenticate = authenticateUser;
exports.checkUserExistsByToken = checkUserExistsByToken;
exports.getListOfSongsForUserByToken = getListOfSongsForUserByToken;
exports.getListOfSongsForUser = getListOfSongsForUser;