var express = require('express');

var app = express();

// Start listening.
var port = process.env.PORT || 3500;
var server = app.listen(port);
console.log('Server listening on port ' + port);

app.post('/message', function(req, res, next) {
	var body = req.body.Body.trim();
	console.log('body', body);
});