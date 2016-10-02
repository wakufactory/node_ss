"use strict";
var server = require('./server.js') ;
var fs = require('fs') ;
//start server
server.start({
	"address":"127.0.0.1",
	"port":8080,
	"docroot":"../client/",
	"api_callback":api,
	"upload_path":upload_path,
	"upload_callback":uploaded
}) ;

//API implementation
function api(q,cb) {
	var ret ;
	switch(q.GET.cmd) {
		case "saveinfo":
			if(q.POST.fname) {
				var fn = upload_path(q.POST)+".json" ;
				fs.writeFile(fn,JSON.stringify(q.POST),function(err){
					console.log("info saved" ) ;
					cb({"stat":0}) ;
				}) ;
			}
			break ;
		case "list":
			fs.readdir(__dirname+"/"+updir, function(err,data) {
				ret = [] ;
				data.forEach(function(f) {
					if(f.substr(0,1)==".") return ;
					ret.push(f) ;
				})
				cb(ret.sort()) ;
			})
			break ;
		default:
			ret = {"stat":-1} ;
			cb(ret) ;
	}
}

//return upload file path
var updir = "../client/updata" ;
function upload_path(q) {
	return __dirname+"/"+updir+"/"+q.fname ;
}
//upload finished
function uploaded(q,cb) {
	cb({"stat":0,"file":updir+"/"+q.GET.fname }) ;
}