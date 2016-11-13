var express = require('express');
var twilio = require('twilio');
var bodyParser = require('body-parser');

var app = express();
app.use(bodyParser.urlencoded({ extended: true }));

// Start listening.
var port = process.env.PORT || 3500;
var server = app.listen(port);
console.log('Server listening on port ' + port);

app.post('/message', twilio.webhook({ validate : false }), function(req, res, next) {
	var body = req.body.Body.trim();

	var resp = new twilio.TwimlResponse();

    var request = require('request');
    request('https://api.seatgeek.com/2/events?client_id=NjE5NTkwOHwxNDc5MDE1MzQ0', 
        function (error, response, body) {

        if (!error && response.statusCode == 200) {
            resp.message(body);
            res.send(resp);
        }
    })
});