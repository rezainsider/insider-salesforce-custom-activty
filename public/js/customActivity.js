define([
    'js/postmonger'
], function(
    Postmonger
) {
    'use strict';

    var connection = new Postmonger.Session();
    // create an empty payload
    var payload = { metaData: { } };

    $(window).ready(onRender);
    connection.on('clickedNext', onClickedNext);
    function onRender() {
// JB will respond the first time 'ready' is called with 'initActivity'
connection.trigger('ready'); } function onClickedNext() {
        /* This activity only has one step. Clicking 'next' or done should update
        the activity payload to be marked as configured. */
        payload.metaData.isConfigured = true;
        connection.trigger('updateActivity', payload);
    }
});
