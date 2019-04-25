'use strict';

const Path = require('path');
const Pkg = require(Path.join(__dirname, '..', 'package.json'));
const express = require('express');
//const jObj=require('jquery');
// Helper utility for verifying and decoding the jwt sent from Salesforce Marketing Cloud.
const verifyJwt = require(Path.join(__dirname, 'lib', 'jwt.js'));
// Helper class that handles all the interactions with Salesforce Service Cloud
// and makes sure open connections are reused for subsequent requests.
var bodyParser = require('body-parser');
const app = express();
const XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;
// Register middleware that parses the request payload.

app.use(bodyParser.raw({
	type: 'application/jwt'
}));

// Route that is called for every contact who reaches the custom split activity
app.post('/activity/execute', (req, res) => {
	console.log("Body in execute->" + req.body);
	var jwt = new verifyJwt({
		appSignature: process.env.jwtSecret
	});

	// Object representing the data in the JWT
	var decoded = jwt.decode(req);
	console.log("Decoded after JWT: " + JSON.stringify(decoded));
	//console.log("decoded length"+JSON.stringify(decoded.inArguments.length));
	if (decoded && decoded.inArguments && decoded.inArguments.length > 0) {
		console.log("decoded->" + decoded);
		var apikey = decoded.inArguments[0]["api_key"];
		var title = decoded.inArguments[0]["title"];
		var message = decoded.inArguments[0]["message"];
		var emailKey = decoded.inArguments[0]["emailKey"];
		var imageUrl = decoded.inArguments[0]["imageUrl"];
		var deepLinkKey = decoded.inArguments[0]["deepLinkKey"];
		var deepLinkVal = decoded.inArguments[0]["deepLinkVal"];
		var channelId = decoded.inArguments[0]["channel_id"];
		var campaignId = decoded.inArguments[0]["camp_id"];
		var contactEmail = decoded.inArguments[0]["emailAddress"];
		console.log("Contact Email--> " + contactEmail);
		var jsonObj = {};
		jsonObj["api_key"] = apikey;
		jsonObj["notifications"] = [];
		var notificationObj = {};
		notificationObj["target"] = {};
		notificationObj["target"][emailKey] = contactEmail;
		notificationObj["title"] = title;
		notificationObj["message"] = message;
		notificationObj["deep_link"] = {};
		notificationObj["deep_link"][deepLinkKey] = deepLinkVal;
		notificationObj["image_url"] = imageUrl;
		if (typeof channelId !== "number" || channelId < 0) {
			channelId = 1
		}
		notificationObj["channel_id"] = channelId;
		notificationObj["camp_id"] = campaignId;
		jsonObj["notifications"].push(notificationObj);
		console.log("Json structure: " + JSON.stringify(jsonObj));
		var xhr = new XMLHttpRequest();
		xhr.open("POST", "https://mobile.useinsider.com/api/v1/notification/user", true);
		xhr.setRequestHeader("Content-Type", "application/json");
		xhr.setRequestHeader("X-Requested-With", "XMLHttpRequest");
		xhr.onreadystatechange = function (e) {
			console.log("status -> ", xhr.status);
			console.log("ready state ", xhr.readyState);
			console.log("response ", xhr.responseText);
			if (xhr.status == 200) {
				res.status(200).end();
			}
		};
		xhr.send(JSON.stringify(jsonObj));
	} else {
		console.error('inArguments invalid.');
		return res.status(400).end();
	}
});

app.post('/activity/save', (req, res) => {
	console.log("Body->" + req.body);
	res.send(200);
});

// Routes for saving, publishing and validating the custom activity. In this case
// nothing is done except decoding the jwt and replying with a success message.
app.post(/\/activity\/(publish|validate)/, (req, res) => {
	var jwt = new verifyJwt({
		appSignature: process.env.jwtSecret
	});

	// Object representing the data in the JWT
	var decoded = jwt.decode(req);
	console.log("Decoded after JWT: " + JSON.stringify(decoded));
	console.log("decode after JWT:" + decoded);
	console.log("Calling publish");
	console.log("Body->" + req.body);

	res.send(200);
});

// Serve the custom activity's interface, config, etc.
app.use(express.static(Path.join(__dirname, '..', 'public')));

// Start the server and listen on the port specified by heroku or defaulting to 12345
app.listen(process.env.PORT || 12345, () => {
	console.log('Service Cloud customsplit backend is now running!');
});