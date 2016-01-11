var User = require('./models/User.js');

var checkUserExistsByToken =  function(token, errFunction, notFoundFunction, successFunction) {
    console.log("Authenticate user with token", token);

    User.findOne({_id: token}, function (err, user) {
        if (err) {
            errFunction(err);
        } else {
            if (user) {
                successFunction(user);
            } else {
                notFoundFunction();
            }
        }
    })
};

exports.authenticate = checkUserExistsByToken;