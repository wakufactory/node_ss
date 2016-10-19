"use strict";
var server = require('./server.js') ;
var api = require('./api_s.js') ;

//start server
server.start({
//	"address":"127.0.0.1",
	"address":"61.193.181.171",
	"port":8080,
	"docroot":"../client/",
	"api_callback":api.process,
	"upload_path":api.upload_path,
	"upload_callback":api.uploaded,
	"dispatch":{
		"/test.html":function(p,temp) {
			console.log(p) ;
			var m = require("mustache") ;
			if(p.list) try { p.list = JSON.parse(p.list) ;} catch(err) {} ;
			return (m)?m.render(temp,p):temp ;
		}
	}
}) ;



