var express = require('express');
var twilio = require('twilio');
var bodyParser = require('body-parser');

var app = express();
app.use(bodyParser.urlencoded({ extended: true }));

var SEATGEEK_CLIENT_ID = 'NjE5NTkwOHwxNDc5MDE1MzQ0';

// Start listening.
var port = process.env.PORT || 3500;
var server = app.listen(port);
console.log('Server listening on port ' + port);

app.post('/message', twilio.webhook({ validate : false }), function(req, res, next) {
	var body = req.body.Body.trim();

	var resp = new twilio.TwimlResponse();

    var request = require('request');
    request('https://api.seatgeek.com/2/events?client_id=' + SEATGEEK_CLIENT_ID, 
        function (error, response, body) {

        if (!error && response.statusCode == 200) {
            var events = JSON.stringify(body);

            resp.message(events.slice(0,30));
            res.send(resp);
        }
    })
});