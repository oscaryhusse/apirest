// Include dependencies
var express = require('express');
var fse = require('fs-extended');
//var fse = require('fs-extra');
var http = require('http');
//var methodOverride = require('method-override');
var mongoose = require('mongoose');
var multer  = require('multer');
var qs = require('querystring');

var app = express();
var server  = http.createServer(app);
var upload = multer({ dest: 'public/' });

app.use(express.methodOverride());
app.use(app.router);

// track and cover POST request
app.post('/', upload.fields([{ name: 'cover', maxCount: 1 }, { name: 'track', maxCount: 1 }]), function (req, res, next) {
	var track = req.files['track'][0];
	console.log('Track uploaded: ' + track);

	fse.move(track.path, '/mnt/nas/tracks/' + track.originalname, function (err) {
   		if (err)
   			return console.error(err);
  		console.log('The track was uploaded successfully');
	});
	
	if (req.files['cover'] !== undefined) {
		var cover = req.files['cover'][0];
		console.log('Cover uploaded: ' + cover);
		
		fse.moveSync(cover.path, '/mnt/nas/covers/' + cover.originalname), function (err) {
   			if (err)
   				return console.error(err);
  			console.log('The cover was uploaded successfully');
		});

//		try {
//			fse.copySync(cover.path, '/mnt/nas/covers/' + cover.originalname);
//		} catch (err) {
//			console.error('Error: ' + err.message)
//		}
//		fse.unlink(cover.path, function(err){
//			if (err)
//				return console.error(err);
//		});
	}
	res.send(200);
})

// track GET request
app.get('/track/:trackname', function(req, res) {
	res.sendfile('/mnt/nas/tracks/' + req.params.trackname);
});

// track DELETE request
app.delete('/track/:trackname', function(req, res) {
	fse.unlink('/mnt/nas/tracks/' + req.params.trackname, function(err){
		if (err)
			return console.error(err);
		console.log('The track was deleted successfully');
	});
	res.send(200);
});

// cover GET request 
app.get('/cover/:covername', function(req, res) {
	res.sendfile('/mnt/nas/covers/' + req.params.covername);
});

// cover DELETE request
app.delete('/cover/:covername', function(req, res) {
	fse.unlink('/mnt/nas/covers/' + req.params.imagename, function(err){
		if (err)
			return console.error(err);
		console.log('The track cover was deleted successfully');
	});
	res.send(200);
});

// Server listening on port 3000
server.listen(3000, function() {
	console.log('Node server running on :3000');
});
