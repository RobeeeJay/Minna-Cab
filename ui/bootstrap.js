"use strict";

/******************************************************************************************

Main bootstrap for the UI of the app

******************************************************************************************/

var spawn = require("child_process").spawn;
var path = require("path");
var fs = require("fs");
var sax = require("sax");

// Declare app level module
var app = angular.module("minnaCab", [
	"ngRoute",
	"ngAnimate"
]);

app.config(["$routeProvider", function($routeProvider) {
	// Configure main routes
	$routeProvider.when("/home", { templateUrl: "home.html" });
	
	// Default redirect
	$routeProvider.otherwise({redirectTo: "/home"});
}]);

app.run(["$rootScope", function($rootScope) {
	$rootScope.test = "MoooOoooOooOO!";
}]);

app.controller("ctrlMame", ["$rootScope", "$scope", "$timeout", function ctrlMame($rootScope, $scope, $timeout) {
	var mamepath = path.normalize(__dirname + "/../emulators/mame/mame64.exe");
	
	$scope.mastergamelist = [];
	$scope.complete = false;
	$scope.games = [];
	$scope.mode = "Loading XML...";
	
	var parseMameXml = function() {
		$scope.mode = "Generating XML...";
		
		var mame = spawn(mamepath, ["-listxml"]);
		var mamexml = "";
		var parser = new sax.parser(true);
		
		mame.stderr.on("data", function(data) {
			console.log("stderr: " + data);
		});
		
		mame.on("close", function(code) {
			console.log("child process exited with code " + code);
		});
		
		var saxStream = sax.createStream(true, { trim: true, normalize: true, lowercase: true });
		saxStream.on("error", function(error) {
			console.error("XML parsing error", error)
	
			// clear the error
			this._parser.error = null
			this._parser.resume()
		});
	
		var lastTag = null;
		saxStream.onopentag = function(node) {
			switch (node.name) {
				case "game":
					$scope.mastergamelist.push(node.attributes);
					break;
				case "input":
					$scope.mastergamelist[$scope.mastergamelist.length - 1].players = node.attributes;
					break;
				case "driver":
					$scope.mastergamelist[$scope.mastergamelist.length - 1].status = node.attributes;
					break;
				case "description":
				case "year":
				case "manufacturer":
					lastTag = node.name;
			}
		};
		
		saxStream.ontext = function(text) {
			$scope.mastergamelist[$scope.mastergamelist.length - 1][lastTag] = text;
		};
		
		saxStream.on("end", function(code) {
			console.log("Finished parsing XML", code);
			$scope.complete = true;
			
			fs.writeFile("mamelist.json", JSON.stringify($scope.mastergamelist), function(error) {
				if (error)
					console.log("Error whilst writing MAME game list", error);
				else
					console.log("Written MAME game list");
			});
			
			$scope.games = $scope.mastergamelist.slice(0, 30);
		});
	
		mame.stdout.pipe(saxStream);
		
		var updateGameCount = function() {
			$scope.mode = "Found " + $scope.mastergamelist.length + " games";
			
			if (!$scope.complete)
				$timeout(updateGameCount, 1000);
		};
		
		$timeout(updateGameCount, 1000);
	};

	fs.readFile("mamelist.json", function(error, data) {
		if (error)
			parseMameXml();
		else {
			$timeout(function() {
				$scope.mastergamelist = JSON.parse(data);
				$scope.complete = true;
				$scope.games = $scope.mastergamelist.slice(0, 30);
			}, 0);
		}
	});

	$scope.launchGame = function(game) {
		console.log(mamepath + " " + game.name);
	};
}]);
