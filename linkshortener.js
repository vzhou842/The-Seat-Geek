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

module.exports = shorten;