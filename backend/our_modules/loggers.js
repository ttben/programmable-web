var winston = require("winston");

winston.loggers.add('usersLog', {
    console: {
      level: 'info',
      colorize: true,
      label: 'Users Log'
    },
    file: {
      filename: __dirname+'/../logs/users/users.log'
    }
  });

var getCategory =  function(category) {
    return winston.loggers.get(category);
};


exports.get = getCategory;