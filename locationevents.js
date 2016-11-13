var message = 'What are events happening around me';


var zip = '77055';
var event;
var client_id = 'NjE5NTkwOHwxNDc5MDE1MzQ0'

var request = require('request');


function getNearbyEvents(zip, callback){
    request('https://api.seatgeek.com/2/events?geoip=' + zip + '&client_id=' + client_id, function (error, response, body) {

        if (!error && response.statusCode == 200) {
            body = JSON.parse(body);
            var reply = "Here are some events happening near you: \n";
            var i;
            var eventName = body.events[0].title;
            for(i = 1; i <= 5; i++){
                reply += i + '. ' + eventName + '\n';
                eventName = body.events[i].title;
            }
            callback(reply);
        }
        else{
            console.log(JSON.stringify(response, null, 2));
        }
    })
}

getNearbyEvents(zip, console.log)
