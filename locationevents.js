var message = 'What are events happening around me';


var zip = '77055';
var event;
var client_id = 'NjE5NTkwOHwxNDc5MDE1MzQ0'

var request = require('request');
var shorten = require('./linkshortener');

function getNearbyEvents(zip, callback){
    request('https://api.seatgeek.com/2/events?geoip=' + zip + '&sort=score.desc&client_id=' + client_id, function (error, response, body) {

        if (!error && response.statusCode == 200) {
            body = JSON.parse(body);

            var eventNames = body.events.map(function(o) { return o.title; });
            var eventUrls = body.events.map(function(o) { return o.url; });
            shorten(eventUrls, function(urls) {
                var message = 'Here are some events happening in ' + body.events[0].venue.city + ':';
                eventNames.forEach(function(title, i) {
                    message += '\n' + (i + 1) + '. ' + title + ': ' + urls[i];
                });
                callback(message);
            });
        }
        else{
            callback("Sorry, we couldn't perform your request.");
        }
    })
}

getNearbyEvents(zip, console.log)

module.exports = {
    getNearbyEvents: getNearbyEvents
}
