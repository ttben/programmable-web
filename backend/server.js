var fs = require("fs");
// We need to use the express framework: have a real web server that knows how to send mime types etc.
var express=require('express');

var morgan     = require("morgan");
var bodyParser = require("body-parser");
var jwt        = require("jsonwebtoken");
var mongoose   = require("mongoose");

// Init globals variables for each module required
var app = express();

// Indicate where static files are located
app.configure(function () {
	app.use(express.static(__dirname + '/'));
});

var port = process.env.PORT || 3001;
var User     = require('./models/User');
var Song     = require('./models/Song');

var db_url = process.env.MONGO_URL || "mongodb://localhost/test";

console.log("ENV MONGO_URL", process.env.MONGO_URL);
console.log("Connecting to db with", db_url);

mongoose.connect(db_url);

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(morgan("dev"));
app.use(function(req, res, next) {
	res.setHeader('Access-Control-Allow-Origin',	 '*');
	res.setHeader('Access-Control-Allow-Methods', 'GET, POST');
	res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type, Authorization');
	next();
});


var db = mongoose.connection;

db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
	// we're connected!
	console.log("Connected to DB");

	console.log("Flushing songs collection ...");
	Song.find().remove().exec();

	var song = new Song(
		{
			url:'http://localhost:3001/songs/1/',
			title:"Lolipop in your life",
			artist:"Moi",
			tracks: [
				{
					name:"moi", uri:"moi.mp3"
				},
				{
					name:"toujours moi", uri:"toujoursMoi.mp3"
				}
			],
			mixes:[]
		});
	song.addMix({mix:"oui", settings:"toujours oui"});
	song.save(function(err, songRes) {
		if(err) {
			console.log("Impossible to store stub song");
		}
		else {
			console.log("Stub song stored !");
		}
	});


	console.log("Flushing user collection ...");
	User.find().remove().exec();

	var user = new User({email: "pw@pw.com", password: "yes", role:"admin"});
	user.save(function(err, userRes) {
		if(err) {
			console.log("Impossible to store stub user");
		}
		else {
			console.log("Stub user stored !");
		}
	});
});

app.get('/songs/', function(req,res) {

	var utility = require('./Utility');

	var token = req.query.token;

	utility.authenticate(token,
		function(err) {
			res.status(500).send("Internal error buddy. Sorry." + err);
		},
		function() {
			res.status(404).send("Can not found the user with specified token " + token);
		},
		function(user) {

			console.log("THE USER HAS ROLE", user.role);
			if(user.role == "public") {
				res.status(401).send("sorry, public can not get the songs bitch");
				return;
			}

			//	Find all songs, delete '__v' attribute,
			//	make the result a plain JS object and exec given function
			Song.find({}, {'__v':0, tracks:0, mixes:0}).lean().exec(function (err, songs) {
				if (err) {
					console.error(err);
					res.status().send(err);
				} else {
					var result = {};
					result.data = songs;
					result.token = token;
					res.send(JSON.stringify(result));
				}
			})
		}
	);
});

app.get('/', function(req,res) {

	res.status(200).send("lol mabite");
});

app.post('/authenticate', function(req, res) {
	User.findOne({email: req.body.email, password: req.body.password}, function(err, user) {
		if (err) {
			res.json({
				type: false,
				data: "Error occured: " + err
			});
		} else {
			if (user) {

				res.json({
					email:user.email,
					token: user._id
				});
			} else {
				res.json({
					type: false,
					data: "Incorrect email/password"
				});
			}
		}
	});
});

app.post('/signup', function(req, res) {
	User.findOne({email: req.body.email, password: req.body.password}, function(err, user) {
		if (err) {
			res.json({
				type: false,
				data: "Error occured: " + err
			});
		} else {
			if (user) {
				res.json({
					type: false,
					data: "User already exists!"
				});
			} else {
				var userModel = new User();
				userModel.email = req.body.email;
				userModel.password = req.body.password;
				userModel.role = req.body.role;

				console.log("ROLE", userModel.role);

				if(userModel.role != "admin" && userModel.role != "user" && userModel.role != "public") {
					res.status(400).send("Specified role " + userModel.role + " unrecognized");
					return;
				}

				userModel.save(function(err, user) {
					res.status(201).send({token:user._id});
				})
			}
		}
	});
});

// Start Server
app.listen(port, function () {
	console.log( "Express server listening on port " + port);
});

/*
// Config
var PORT = 8081,
	TRACKS_PATH = './multitrack/';
// launch the http server on given port
server.listen(PORT);
console.log("Server listening on ", PORT, "...");

// routing
app.get('/', function (req, res) {
	res.sendfile(__dirname + '/index.html');
});
 */

// routing
app.get('/track', function (req, res) {
	function sendTracks(trackList) {
		if (!trackList)
			return res.send(404, 'No track found');
		res.writeHead(200, { 'Content-Type': 'application/json' });
		res.write(JSON.stringify(trackList));
		res.end();
	}

	getTracks(sendTracks); 
});

// routing
app.get('/track/:id', function (req, res) {
	var id = req.params.id;
	
	function sendTrack(track) {
		if (!track)
			return res.send(404, 'Track not found with id "' + id + '"');
		res.writeHead(200, { 'Content-Type': 'application/json' });
		res.write(JSON.stringify(track));
		res.end();
	}

	getTrack(id, sendTrack); 

});

// routing
app.get(/\/track\/(\w+)\/(?:sound|visualisation)\/((\w|.)+)/, function (req, res) {
	res.sendfile(__dirname + '/' + TRACKS_PATH + req.params[0] + '/' + req.params[1]);
});

function getTracks(callback) {
	getFiles(TRACKS_PATH, callback);
}

function getTrack(id, callback) {
	getFiles(TRACKS_PATH + id, function(fileNames) {
		var track = {
			id: id,
			instruments: []	
		};
		fileNames.sort();
		for (var i = 0; i < fileNames.length; i += 2) {
			var instrument = fileNames[i].match(/(.*)\.[^.]+$/, '')[1];
			track.instruments.push({
				name: instrument,
				sound: instrument + '.mp3',
				visualisation: instrument + '.png'
			});
		}
		callback(track);
	})
}

function getFiles(dirName, callback) {
	fs.readdir(dirName, function(error, directoryObject) {
		callback(directoryObject);
	});
}

