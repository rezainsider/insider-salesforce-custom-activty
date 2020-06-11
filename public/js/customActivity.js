define([
    'postmonger'
], function (
    Postmonger
) {
    'use strict';
    var Postmonger = require('postmonger');
    var connection = new Postmonger.Session();
    var payload = {};

    $(window).ready(function () {
        connection.trigger('ready');
        connection.trigger('requestInteraction');
    });

    function initialize(data) {
        if (data) {
            payload = data;
        }
        console.log("New-> " + JSON.stringify(payload));
        var api_key = payload["arguments"].execute.inArguments[0]["api_key"];
        var title = payload["arguments"].execute.inArguments[0]["title"];
        var description = payload["arguments"].execute.inArguments[0]["description"];
        var image_url = payload["arguments"].execute.inArguments[0]["image_url"];
        var banner = payload["arguments"].execute.inArguments[0]["banner"];
        var push_url = payload["arguments"].execute.inArguments[0]["push_url"];

        $("#api_key").val(api_key);
        $("#title").val(title);
        $("#description").val(description);
        $("#image_url").val(image_url);
        $("#banner").val(banner);
        $("#push_url").val(push_url);
    }

    function save() {
        var api_key = $("#api_key").val();
        var title = $("#title").val();
        var description = $("#description").val();
        var image_url = $("#image_url").val();
        var banner = $("#banner").val();
        var push_url = $("#push_url").val();

        payload["arguments"].execute.inArguments[0]["api_key"] = api_key;
        payload["arguments"].execute.inArguments[0]["title"] = title;
        payload["arguments"].execute.inArguments[0]["description"] = description;
        payload["arguments"].execute.inArguments[0]["image_url"] = image_url;
        payload["arguments"].execute.inArguments[0]["banner"] = banner;
        payload["arguments"].execute.inArguments[0]["push_url"] = push_url;

        payload["metaData"]["isConfigured"] = true;
        console.log("Payload is -> " + JSON.stringify(payload));
        connection.trigger('updateActivity', payload);
    }

    connection.on('initActivity', initialize);
    connection.on('clickedNext', save);
});
