var client_id = 'NjE5NTkwOHwxNDc5MDE1MzQ0'

var request = require('request');
var shorten = require('./linkshortener');
var getQueryEvents = require('./query');

var city = 'houston';
var taxonomy = 'sports';

function getTaxonomyEvents(city, taxonomy, callback){
    taxonomy = taxonomy.replace(" ","_");
    request('https://api.seatgeek.com/2/events?taxonomies.name=' + taxonomy + '&venue.city=' + city + '&sort=score.desc&client_id=' + client_id, function (error, response, body) {

        if (!error && response.statusCode == 200) {
            body = JSON.parse(body);
            var events = body.events.slice(0, 5);
            if(events.length === 0){
                getQueryEvents(city, taxonomy, callback);
                return;
            }
            var eventNames = events.map(function(o) { return o.title; });
            var eventUrls = events.map(function(o) { return o.url; });
            shorten(eventUrls, function(urls) {
                var message = 'Here are some ' + taxonomy.replace("_", " ") + ' events happening in ' + events[0].venue.city + ':';
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

getTaxonomyEvents(city, taxonomy, console.log);

module.exports = {
    getTaxonomyEvents: getTaxonomyEvents,
};

