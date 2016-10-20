//API implementation
var fs = require('fs') ;
module.exports.process = function(q,cb) {
	var ret ;
	var ssid = q.cookie.ssid ;
	if(!ssid) ssid = new Date().getTime() ;
	console.log("ssid="+ssid);
	switch(q.GET.cmd) {
		case "saveinfo":
			if(q.POST.fname) {
				var fn = exports.upload_path(q.POST)+".json" ;
				q.POST.ssid = ssid ;
				fs.writeFile(fn,JSON.stringify(q.POST),function(err){
					console.log("info saved" ) ;
					cb({"stat":0},{ssid:ssid}) ;
				}) ;
			}
			break ;
		case "list":
			var dir = __dirname+"/"+updir ;
			console.log(dir) ;
			fs.readdir(dir, function(err,data) {
				ret = [] ;
				if(data)
					data.forEach(function(f) {
						if(f.substr(0,1)==".") return ;
						if(f.match(/json$/)) {
							ret.push(JSON.parse(fs.readFileSync(dir+"/"+f))) ; 
						}
					})
				cb(ret,{ssid:ssid}) ;
			})
			break ;
		default:
			ret = {"stat":-1} ;
			cb(ret) ;
	}
}
//return upload file path
var updir = "../client/updata" ;
module.exports.upload_path = function(q) {
	return __dirname+"/"+updir+"/"+q.fname ;
}

//upload finished
module.exports.uploaded = function(q,cb) {
	cb({"stat":0,"file":updir+"/"+q.GET.fname }) ;
}