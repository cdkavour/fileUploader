var querystring = require('querystring'),
	fs = require('fs'),
	formidable = require('formidable'),
	view = require('./view'),
	util = require('util');

function start(res) {
	console.log("request handler 'start' was called");
	
	res.writeHead(200, {"Content-Type": "text/html"});
	res.write(view.uploadBox);
	res.end();
};


//	Is currently causing problems when requesting /upload directly
function upload(res, req) {
	console.log("request handler 'upload' was called");

	var form = new formidable.IncomingForm();
	console.log("about to parse");
	form.parse(req, function(error, fields, files) {
		console.log("parsing done");

		//	Possible error on Windows systems:
		//	renaming an already existing file
		fs.rename(files.upload.path, "/tmp/test.png", function(error) {
			if (error) {
				fs.unlink("/tmp/test.png");
				fs.rename(files.upload.path, "/tmp/test.png");
			}
		});

		res.writeHead(200, {"Content-Type": "text/html"});
		res.write("received file:<br/>");
		res.write("<img src='/show' />");
		res.end();
	});
}

function show(res) {
	console.log("request handler 'show' was called");
	res.writeHead(200, {"Content-Type": "image/png"});
	fs.createReadStream("/tmp/test.png").pipe(res);
	// res.write(
	// 	    '<form action="/upload" enctype="multipart/form-data" method="post">'+
 //    '<input type="text" name="title"><br>'+
 //    '<input type="file" name="upload" multiple="multiple"><br>'+
 //    '<input type="submit" value="Upload">'+
 //    '</form>'
	// );
}

exports.start = start;
exports.upload = upload;
exports.show = show;
