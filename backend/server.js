// Import the express library
var express = require('express');
var app = express();
var path = require('path');
var axios = require('axios');
// This is the client ID and client secret that you obtained
// while registering the application which we will obtain from the environment variabl
var clientID = process.env.CLIENT_ID;
var clientSecret = process.env.CLIENT_SECRET;
app.set('port', (process.env.PORT || 5000));
app.use(express.static(__dirname + '/public'));
app.get('/', function (request, res) {
	res.sendFile(path.join(__dirname + '/public/index.html'));
});
app.listen(app.get('port'), function () {
	console.log("Node app is running at localhost:" + app.get('port'))
});