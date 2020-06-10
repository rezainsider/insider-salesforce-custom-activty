var express = require('express');
var app = express();
var path = require('path');
var axios = require('axios');


var clientID = process.env.CLIENT_ID;
var clientSecret = process.env.CLIENT_SECRET;

app.set('port', (process.env.PORT || 44807));
app.use(express.static(__dirname + '/public'));


app.get('/', function(request, res) {
    res.sendFile(path.join(__dirname + '/public/index.html'));
});

app.get('/oauth/redirect', (req, res) => {
    /* The req.query object has the query params that
    were sent to this route. We want the `code` param and the tenant specific endpoint (TSE) for the user */
    var requestToken = req.query.code;
    var tse = req.query.tssd;
    axios({
// make a POST request
        method: 'post', // and request token
        url: `https://${tse}.auth-qa1.marketingcloudqaapis.com/v2/token`,
        // Set the content type header, so that we get the response in JSON
        headers: {
            accept: 'application/json'
        },
        data: {
            "grant_type": "authorization_code",
            "code": `${requestToken}`,
            "client_id": `${clientID}`,
            "client_secret": `${clientSecret}`,
            "redirect_uri": "https://intense-castle-21074.herokuapp.com/oauth/redirect" }
    }).then((response) => {
        /* Once we get the response, extract the access token from
        the response body */
        var accessToken = response.data.access_token
        console.log(accessToken);
        // OPTIONAL: test token by using it in a call
        axios({
// make a sample GET request using the access token
            method: 'get', // and request user info
            url: `https://${tse}.auth-qa1.marketingcloudqaapis.com/v2/userinfo`,
            headers: {
                Authorization: `Bearer ${accessToken}` }
        }) .then(res => {
            return res.data; }) .then((response) => {
            console.log(response);
            // Once we get the response, extract the user information
            var stringifiedUserName = JSON.stringify(response.user.name);
            res.redirect(`/welcome.html?name=${stringifiedUserName}`)
        }).catch(function (error) {
            console.log(error);
        })
    }).catch(function (error) {
        console.log(error);
    })
});

app.listen(app.get('port'), function() {
    console.log("Node app is running at localhost:" + app.get('port'))
});
