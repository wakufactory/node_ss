"use strict";
var server = require('./server.js') ;

server.start({
	"address":"127.0.0.1",
	"port":8080,
	"docroot":"../client/",
	"api_callback":api,
	"upload_path":upload_path,
	"upload_callback":upload
}) ;

var updir = "../client/updata/" ;

//APIの実装
function api(q,cb) {
	cb(q) ;
}

function upload_path(q) {
	return updir+q.name ;
}
function upload(q,cb) {
	cb({"file":updir+q.name }) ;
}