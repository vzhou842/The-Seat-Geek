var request = require('request');

function shorten(url, callback) {
	request('http://tinyurl.com/api-create.php?url=' + url, function(err, response, body) {
		if (!err && response.statusCode === 200) {
			callback(body);
		} else {
			callback(url);
		}
	});
}

function shortenAll(urls, callback) {
	var ret = [];
	var numDone = 0;
	urls.forEach(function(url, index) {
		shorten(url, function(short) {
			ret[index] = short;
			numDone++;
			if (numDone >= urls.length) {
				callback(ret);
			}
		});
	});
}

module.exports = shortenAll;