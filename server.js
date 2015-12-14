var fs = require("fs");
// We need to use the express framework: have a real web server that knows how to send mime types etc.
var express=require('express');

// Init globals variables for each module required
var app = express()
, http = require('http')
, server = http.createServer(app);

// Indicate where static files are located  
app.configure(function () {  
	app.use(express.static(__dirname + '/'));  
});  

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

