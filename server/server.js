var http = require('http');
var url = require('url') ;
var fs = require('fs') ;
var settings = require('./settings.js') ;

function log(str) {
	console.log(str) ;
} 

http.createServer((req, res) => {
	log("request "+req.url) ;
	let url_parts = url.parse(req.url,true);

	//レスポンスのJSONを返す
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
		//GETの時
		if(req.method=='GET') {
			api({"GET":url_parts.query},(ret) => {
				retresp(res,ret) ;	
			}) ;
		//POSTの時
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
				api({"POST":p,"GET":url_parts.query},(ret)=> {
					retresp(res,ret);
				})
			})				
		}
	//ファイルアップロードAPI
	} else if(req.method=='POST' && url_parts.pathname=="/upload/"){
		let fn = settings.updir+url_parts.query.name ;
		let fp = fs.createWriteStream(fn) ;
		req.pipe(fp) ;
		log("save to "+fn) ;

		req.on("end",()=>{
			log("upload end") ;
			let r = '{"status":0}' ;
			retresp(res,r) ;
		})
//API以外のファイル送信処理
	} else {
		fs.readFile('.'+url_parts.pathname.replace("..",""),(err,text)=> {
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
}).listen(settings.port, settings.server);

//APIの実装
function api(q,cb) {
	cb(q) ;
}