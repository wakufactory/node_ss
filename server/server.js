"use strict";
var http = require('http');
var url = require('url') ;
var fs = require('fs') ;

function log(str) {
	console.log(str) ;
} 

exports.start = function(opt) {

http.createServer((req, res) => {
	log("request "+req.url) ;
	let url_parts = url.parse(req.url,true);

	//return response JSON
	function retresp(res,data) {
		let r = JSON.stringify(data) ;
		res.writeHead(200, {'Content-Type':'text/json;charset=UTF-8',
			"Content-Length":Buffer.byteLength(r, 'utf-8')});
		res.end(r);			
	}
//API処理
	if(url_parts.pathname=="/api/") {
		log("api") ;
		log(url_parts.query) ;
		//GET
		if(req.method=='GET') {
			opt.api_callback({"GET":url_parts.query},(ret) => {
				retresp(res,ret) ;	
			}) ;
		//POST
		} else if(req.method=='POST') {
			let data = "" ;
			req.on("readable",()=> {
				let d = req.read() ;
				if(d!=null) {
					data += d.toString() ;
				}
			});
			req.on("end",()=>{
				log("post end") ;
				let p = JSON.parse(data);
				log(p) ; 
				opt.api_callback({"POST":p,"GET":url_parts.query},(ret)=> {
					retresp(res,ret);
				})
			})				
		}
	//file upload API
	} else if(req.method=='POST' && url_parts.pathname=="/upload/"){
		
		let fn = opt.upload_path(url_parts.query) ;
		let fp = fs.createWriteStream(__dirname+"/"+fn) ;
		req.pipe(fp) ;
		log("save to "+fn) ;

		req.on("end",()=>{
			log("upload end") ;
			opt.upload_callback(url_parts.query,(ret)=>{
				retresp(res,ret) ;				
			})
		})
//file transfer
	} else {
		fs.readFile(__dirname+"/"+opt.docroot+url_parts.pathname.replace("..",""),(err,text)=> {
			if(!err) {
				let ext ="" ;
				if(url_parts.pathname.match(/\.([^.]+)$/)) {
					ext = RegExp.$1 ;
				}
				let mime ="text/html" ;
				let mimes = {'js':"text/javascript",'css':"text/css",'jpg':"image/jpeg",'jpeg':"image/jpeg",'png':"image/png"} ;
				if(mimes[ext]) mime = mimes[ext] ;
				res.writeHead(200, {'Content-Type': mime,'Cache-Control':"public"});
				res.end(text) ;					
			}else {
				res.writeHead(404);	
				res.end("404");				
			}
		});			
	}
}).listen(opt.port, opt.address);
log("server started") ;
}