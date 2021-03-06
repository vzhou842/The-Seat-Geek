var request = require('request');
var shorten = require('./linkshortener');

var SEATGEEK_CLIENT_ID = 'NjE5NTkwOHwxNDc5MDE1MzQ0';

// @param callback Takes one param, message.
function getRecommendation(performer, zip, callback) {
	performer = performer.toLowerCase().replace(' ', '-');
	request('https://api.seatgeek.com/2/performers?slug=' + performer, function(err, response, body) {
		if (!err & response.statusCode === 200) {
			body = JSON.parse(body);
			if (!body.performers.length) {
				callback('Sorry, we couldn\'t find anything similar to that near you.');
			} else {
				var performer = body.performers[0];
				request('https://api.seatgeek.com/2/recommendations?performers.id=' + performer.id + '&postal_code=' + zip + '&client_id=' + SEATGEEK_CLIENT_ID,
					function(err, response, body) {
						if (!err && response.statusCode === 200) {
							body = JSON.parse(body);
							var recs = body.recommendations.slice(0, 5);
							var titles = recs.map(function(o) { return o.event.title; });
							var urls = recs.map(function(o) { return o.event.url; });

							shorten(urls, function(urls) {
								var message = 'We might have found some events you might like:';
								titles.forEach(function(title, i) {
									message += '\n' + (i + 1) + '. ' + title + ': ' + urls[i];
								});
								callback(message);
							});
						} else {
							callback('An error occurred.');
						}
					}
				);
			}
		} else {
			callback('An error occurred.');
		}
	});
}

module.exports = {
	getRecommendation: getRecommendation,
};