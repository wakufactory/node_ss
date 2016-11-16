var fs = require('fs') ;
var api = require('../server/api_s.js') ;
var cookie = {} ;
var API = {
	get:function(p) {
		return new Promise(function(resolve,reject) {
			var q = {'GET':p,'cookie':cookie} ;
			api.process(q,function(ret,cook) {
				if(cook) cookie = cook ;
				resolve(ret) ;
			}) ;
		});
 	},
 	post:function(p,f) {
		return new Promise(function(resolve,reject) {
			var q = {'GET':p,'POST':JSON.parse(f),'cookie':cookie} ;
			api.process(q,function(ret,cook) {
				if(cook) cookie = cook ;
				resolve(ret) ;
			}) ;
		});
 	},
  	upload:function(p,data,prog) {
		return new Promise(function(resolve,reject) {
			var reader = new FileReader() ;
			reader.onload = (e)=> {
				var f  = api.upload_path(p) ;
				console.log("file save"+f) ;
				var buf = Buffer.from(e.target.result) ;
				console.log(buf.length) ;
				prog({'total':buf.length,'loaded':0}) ;
				fs.writeFile(f,buf,(err)=>{
					if(err) {
						reject(err) ;
						return ;
					}
					console.log("file saved") ;
					prog({'total':buf.length,'loaded':buf.length}) ;
					ret = api.uploaded({"GET":p},function(ret) {
						resolve(ret) ;	
					})
				}) ;
			}
			reader.readAsArrayBuffer(data) ;
		});
 	},
 	formJSON:function(f) {
		var fs = f.querySelectorAll("input,select,textarea") ;
		var ret = {} ;
		Array.prototype.forEach.call(fs,function(e) {
			if(e.type=="radio"){
				if(e.checked) ret[e.name] = e.value; 
				else if(ret[e.name]==undefined) ret[e.name] = null ;
			} else if(e.type=="checkbox") {
				if(!ret[e.name]) ret[e.name] = {} ;
				ret[e.name][e.value] = e.checked ;
			} else {
				ret[e.name] = e.value ;
			}
		});
		return ret ;
	},
	open_window:function(url) {
		let ipc = require('electron').ipcRenderer ;
		ipc.on('resoinseMessage',function(ev,arg) {
			console.log(arg) ;
		}) ;
		ipc.send('requestMessage',{cmd:"open_window",url:url}) ;
	}
}