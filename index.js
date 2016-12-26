var express = require('express');
var bodyParser = require('body-parser');
var request = require('request');
var app = express();

app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
app.listen((process.env.PORT || 3000));

// Server frontpage
app.get('/', function (req, res) {
    res.send('This is anonBot Server');
});

// Facebook Webhook
app.get('/webhook', function (req, res) {
    if (req.query['hub.verify_token'] === 'anondfeline_anonbot_verify_token') {
        res.send(req.query['hub.challenge']);
    } else {
        res.send('Invalid verify token');
    }
});

app.post('/webhook', function (req, res) {
    var events = req.body.entry[0].messaging;
    for (i = 0; i < events.length; i++) {
        var event = events[i];
        if (event.message && event.message.text) {
			var word = event.message.text;
			var lol = /.*L+O+L+.*/i;
			var lmao = /.*L+M+A+O+.*/i;
			var rofl = /.*R+O+F+L+.*/i;
			var haha = /.*H+A+.*/i;
			var outString = "Echo: " + word;
			var outArrs = ["Haha you so funny!","HAHA YEAH AM LAUGHING MY ASS OFF TOO!","lel","whut\nlol","hahahahahahahahahahahahaha"];
			if(lol.test(word) || lmao.test(word) || rofl.test(word) || haha.test(word)){
				var num = Math.floor(Math.random()*5);
				outString = outArrs[num];
			}
			sendMessage(event.sender.id, {text: outString});
        }
    }
    res.sendStatus(200);
});

function sendMessage(recipientId, message) {
    request({
        url: 'https://graph.facebook.com/v2.6/me/messages',
        qs: {access_token: process.env.PAGE_ACCESS_TOKEN},
        method: 'POST',
        json: {
            recipient: {id: recipientId},
            message: message,
        }
    }, function(error, response, body) {
        if (error) {
            console.log('Error sending message: ', error);
        } else if (response.body.error) {
            console.log('Error: ', response.body.error);
        }
    });
};