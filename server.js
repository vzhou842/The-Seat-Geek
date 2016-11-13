var express = require('express');
var twilio = require('twilio');
var bodyParser = require('body-parser');
var request = require('request');

var app = express();
app.use(bodyParser.urlencoded({ extended: true }));

// Start listening.
var port = process.env.PORT || 3500;
var server = app.listen(port);
console.log('Server listening on port ' + port);

var getRecommendation = require('./recommendations').getRecommendation;
var getNearbyEvents = require('./locationevents').getNearbyEvents;
var getEventsAtVenue = require('./venues');

app.post('/message', twilio.webhook({ validate : false }), function(req, res, next) {
	var body = req.body.Body.trim().toLowerCase();

	// Is there anything like <performer> near <zip>?
	var recString = 'is there anything like';
	if (body.substring(0, recString.length) === recString) {
		getRecommendation(body.substring(recString.length + 1, body.length - 12), body.substring(body.length - 6, body.length - 1),
			sendMessage.bind(null, res)
		);
	}

    recString = 'what are events happening in '
    if (body.substring(0, recString.length) == recString){
        getNearbyEvents(body.substring(body.length - 6, body.length - 1), sendMessage.bind(null, res));
    }

    // What events are happening at <venue>?
    var venString = 'what events are happening at ';
    if (body.substring(0, venString.length) === venString) {
		getEventsAtVenue(body.substring(venString.length + 1, body.length - 1), sendMessage.bind(null, res));
	}
});

function sendMessage(res, message) {
	var resp = new twilio.TwimlResponse();
	resp.message(message);
	res.send(resp);
}