var app = require("app");
var browserWindow = require("browser-window");

// Make sure main window survives GC
var mainWindow = null;

app.on("window-all-closed", function() {
	if (process.platform != "darwin")
		app.quit();
});

app.on("ready", function() {
	mainWindow = new browserWindow({ width: 800, height: 600 });

	mainWindow.loadUrl("file://" + __dirname + "/html/index.html");

	mainWindow.on("closed", function() {
		// Allow GC on window element
		mainWindow = null;
	});
	
	mainWindow.webContents.on("did-finish-load", function() {
		mainWindow.openDevTools();
	});
});
