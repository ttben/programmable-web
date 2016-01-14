var mongoose     = require('mongoose');
var Schema = mongoose.Schema;

var UserSchema   = new Schema({
    email: String,
    password: String,
    role:String
});

//
//var SongLib = require('./Song');
//console.log("SongLib = ", SongLib);
var usersLog = require("../our_modules/loggers").get('usersLog');
var User = mongoose.model('User', UserSchema);


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


User.signUp = signUp;
User.authenticate = authenticateUser;
User.checkUserExistsByToken = checkUserExistsByToken;

module.exports = User;


