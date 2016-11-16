#node.js simple server for web-app

##spec

 - This server processes static file and API call 
 - API returns JSON format
 - POST API also receives JSON format 
 - File upload API receives raw file data
 - cookie support
 - electron compatible

##require 

 - node v4 or later 
 - no extensions required

##modules

 - server/server.js : simple server module 
 - server/main.js : server main 
 - server/api_s.js : API implement
 - client/index.html : sample web app page
 - clinet/js/api.js : API call class 
 - electron : electron modules
 - electron/js/api.js : API call for electron

##sample

simple image uploader 

###client-server model
 1. start server: node main.js
 1. open browser: http://localhost:8080/index.html
 
###for electron
 1. start electron at electron folder 
 