'use strict';

var electron = require('electron');
var app = electron.app;
var BrowserWindow = electron.BrowserWindow;
var ipc = electron.ipcMain ;

var mainWindow = null;
app.on('ready', function() {
	// ブラウザ(Chromium)の起動, 初期画面のロード
	mainWindow = new BrowserWindow({width: 650, height: 550,"allowpopups":"true"});
	mainWindow.loadURL('file://' + __dirname + '/client/index.html');
	//for debug
	mainWindow.webContents.openDevTools() ;
	mainWindow.webContents.on('new-window', (event, url) => {
		event.preventDefault();
		electron.shell.openExternal(url);
	})
	mainWindow.on('closed', function() {
		mainWindow = null;
	});
});

app.on('window-all-closed', function() {
  app.quit();
});

ipc.on('requestMessage',function(ev,args){
	if(args.cmd=="open_window") {
		var subWindow = new BrowserWindow({width: 650, height: 550,"allowpopups":"false"});
		subWindow.loadURL(args.url);
		ev.sender.send('resoinseMessage',"ok") ;
	}
})
