"use strict";
var server = require('./server.js') ;
var fs = require('fs') ;
//サーバ起動
server.start({
	"address":"127.0.0.1",
	"port":8080,
	"docroot":"../client/",
	"api_callback":api,
	"upload_path":upload_path,
	"upload_callback":uploaded
}) ;

//APIの実装
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
				cb(data) ;
			})
			break ;
		default:
			ret = {"stat":-1} ;
			cb(ret) ;
	}
}

//アップロードファイルパスの決定
var updir = "../client/updata" ;
function upload_path(q) {
	return __dirname+"/"+updir+"/"+q.fname ;
}
//アップロード終了時処理
function uploaded(q,cb) {
	cb({"stat":0,"file":updir+"/"+q.GET.fname }) ;
}