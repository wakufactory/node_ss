"use strict";
var server = require('./server.js') ;
var api = require('./api_s.js') ;

//start server
server.start({
	"address":"127.0.0.1",
	"port":8080,
	"docroot":"../client/",
	"api_callback":api.process,
	"upload_path":api.upload_path,
	"upload_callback":api.uploaded
}) ;



