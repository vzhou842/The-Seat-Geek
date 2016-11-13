var message = 'What are events happening around me';

var client_id = 'NjE5NTkwOHwxNDc5MDE1MzQ0'

var request = require('request');
var shorten = require('./linkshortener');

function getNearbyEvents(city, callback){

    request('https://api.seatgeek.com/2/events?venue.city=' + city + '&sort=score.desc&client_id=' + client_id, function (error, response, body) {

        if (!error && response.statusCode == 200) {
            body = JSON.parse(body);
            var events = body.events.slice(0, 5);
            var eventNames = events.map(function(o) { return o.title; });
            var eventUrls = events.map(function(o) { return o.url; });
            shorten(eventUrls, function(urls) {
                var message = 'Here are some popular events happening in ' + events[0].venue.city + ':';
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

module.exports = {
    getNearbyEvents: getNearbyEvents,
};
