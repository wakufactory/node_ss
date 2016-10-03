"use strict";
var http = require('http');
var url = require('url') ;
var fs = require('fs') ;
var mimes = {'js':'text/javascript;charset="UTF-8"','css':'text/css;charset="UTF-8"','xml':'text/xml;charset="UTF-8"','jpg':"image/jpeg",'jpeg':"image/jpeg",'png':"image/png",'gif':"image/gif",'svg':"image/svg+xml",'woff':"application/font-woff",'otf':"application/x-font-otf"} ;

function log(str) {
	console.log(str) ;
} 

exports.start = function(opt) {
http.createServer((req, res) => {
	var d = new Date() ;
	log(d.toLocaleString()+" "+req.url) ;
	let url_parts = url.parse(req.url,true);
	let query = url_parts.query ;

	//return response JSON
	function retresp(res,data) {
		let r = JSON.stringify(data) ;
		res.writeHead(200, {'Content-Type':'text/json;charset="UTF-8"',
			"Content-Length":Buffer.byteLength(r, 'utf-8')});
		res.end(r);			
	}
//API process
	if(url_parts.pathname=="/api/") {
		log("api") ;
		log(query) ;
		//GET
		if(req.method=='GET') {
			opt.api_callback({"GET":query},(ret) => {
				retresp(res,ret) ;	
			}) ;
		//POST
		} else if(req.method=='POST') {
			let data = "" ;
			req.on("readable",()=> {
				let d = req.read() ;
				if(d!=null) data += d.toString() ;
			});
			req.on("end",()=>{
				log("post end") ;
				let p = JSON.parse(data);
				log(p) ; 
				opt.api_callback({"POST":p,"GET":query},(ret)=> {
					retresp(res,ret);
				})
			})				
		}
	//file upload API
	} else if(req.method=='POST' && url_parts.pathname=="/upload/"){
		
		let fn = opt.upload_path(query) ;
		let fp = fs.createWriteStream(fn) ;
		req.pipe(fp) ;
		log("save to "+fn) ;

		req.on("end",()=>{
			log("upload end") ;
			opt.upload_callback({"GET":query},(ret)=>{
				retresp(res,ret) ;				
			})
		})
//file transfer
	} else {
		var pn = decodeURI(url_parts.pathname).replace("..","") ;
		var fn = __dirname+"/"+opt.docroot+pn ;
		fs.stat(fn,(err,stat) => {
			if(err || !stat.isFile()) {
				res.writeHead(404);	
				res.end("404");					
			} else {
				let ext ="" ;
				if(pn.match(/\.([^.]+)$/)) ext = RegExp.$1.toLowerCase() ;
				let mime ='text/html;charset="UTF-8"';
				if(mimes[ext]) mime = mimes[ext] ;
				res.writeHead(200, {'Content-Type': mime,'Cache-Control':"public"});	
				fs.createReadStream(fn).on('error',()=>{
					res.end("error");	
				}).pipe(res);
			}
		})		
	}
}).listen(opt.port, opt.address);
log("server started") ;
}