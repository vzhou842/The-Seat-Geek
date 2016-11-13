var client_id = 'NjE5NTkwOHwxNDc5MDE1MzQ0'

var request = require('request');
var shorten = require('./linkshortener');

var city = 'houston';
var query = 'football';

function getQueryEvents(city, query, callback){
    query = query.replace("_","+");
    request('https://api.seatgeek.com/2/events?venue.city=' + city + '&q=' + query + '&sort=score.desc&client_id=' + client_id, function (error, response, body) {

        if (!error && response.statusCode == 200) {
            body = JSON.parse(body);
            var events = body.events.slice(0, 5);
            if(events.length === 0){
                callback("Sorry, but we weren't able to find any events in " + city + ".");
                return;
            }
            var eventNames = events.map(function(o) { return o.title; });
            var eventUrls = events.map(function(o) { return o.url; });
            shorten(eventUrls, function(urls) {
                var message = 'Here are some events about ' + query.replace('+', ' ') + ' happening in ' + events[0].venue.city + ':';
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
    getQueryEvents: getQueryEvents,
};