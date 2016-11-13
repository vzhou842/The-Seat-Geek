var request = require('request');
var shorten = require('./linkshortener');

var SEATGEEK_CLIENT_ID = 'NjE5NTkwOHwxNDc5MDE1MzQ0';

function getEventsAtVenue(venue, callback) {
	venue = venue.toLowerCase().replace(' ', '-');
	request('https://api.seatgeek.com/2/venues?q=' + venue, function(err, response, body) {
		if (!err & response.statusCode === 200) {
			body = JSON.parse(body);
			if (!body.venues.length) {
				callback('Sorry, we don\'t recognize that venue.');
			} else {
				var venue = body.venues[0];

				// Events API
				request('https://api.seatgeek.com/2/events?venue.id=' + venue.id, function(err, response, body) {
					if (!err & response.statusCode === 200) {
						body = JSON.parse(body);
						var events = body.events;
						var loc = venue.name + ' in ' + venue.display_location;
						if (!events.length) {
							callback('There are no events happening at ' + loc + ' in the near future :(')
						} else {
							var titles = events.map(function(event) { return event.title; });
							var urls = events.map(function(event) { return event.url; });

							shorten(urls, function(urls) {
								var message = 'We found some events at ' + loc + ':';
								titles.forEach(function(title, i) {
									message += '\n' + (i + 1) + '. ' + title + ': ' + urls[i];
								});
								callback(message);
							});
						}
					} else {
						callback('An error occurred.');
					}
				});
			}
		} else {
			callback('An error occurred.');
		}
	});
}

module.exports = getEventsAtVenue;
