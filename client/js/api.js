var API = {
	get:function() {
		return new Promise(function(resolve,reject) {
			var req = new XMLHttpRequest();
			req.open("get","/api/?cmd=getall",true) ;
			req.responseType = "json" ;
			req.onload = function() {
				if(req.status==200) {
					resolve(req.response) ;
				} else {
					reject(req.status) ;					
				}
			}
			req.send() ;
		})
	},
	post:function(f) {
		return new Promise(function(resolve,reject) {
			var req = new XMLHttpRequest();
			req.open("post","/api/?cmd=post",true) ;
			req.responseType = "json" ;
			req.setRequestHeader("Content-Type","text/json;charset=UTF-8");
			req.onload = function() {
				if(req.status==200) {
					resolve(req.response) ;
				} else {
					reject(req.status) ;					
				}
			}
			req.send(f) ;
		})
	},
	upload:function(name,data) {
		return new Promise(function(resolve,reject) {
			var req = new XMLHttpRequest();
			req.open("post","/upload/?name="+name,true) ;
			req.responseType = "json" ;
			req.onload = function() {
				if(req.status==200) {
					resolve(req.response) ;
				} else {
					reject(req.status) ;					
				}
			}
			req.upload.addEventListener("progress", function(ev){
				console.log((ev.loaded/ev.total)*100) ;
			},false);
//			var dv = new DataView(data) ;
			console.log("send start") ;
			req.send(data) ;
		})
	}
}