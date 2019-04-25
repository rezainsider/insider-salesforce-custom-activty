"use strict";

var jwtLib = require('jwt-simple');
var packageJson = require('../../package.json');

var VERSION = packageJson.version;

var JwtDecoder = module.exports = function JwtDecoder( options ) {
    this.options = options || {};
};

JwtDecoder.VERSION = VERSION;

JwtDecoder.prototype.decode = function( req ) {
    var jwtObj = {};
    var jwt = req.body;

    try {
        var decoded = jwtLib.decode(jwt.toString('utf8'), this.options.appSignature);
        jwtObj = decoded;
    } catch( ex ) {
        console.error( 'Decoding failed for jwt: ' + jwt );
        console.error( 'Exception: ' + ex );
    }

    return jwtObj;
}; 
