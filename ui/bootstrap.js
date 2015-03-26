"use strict";

/******************************************************************************************

Main bootstrap for the UI of the app

******************************************************************************************/

var spawn = require("child_process").spawn;
var path = require("path");
var xml2js = require("xml2js");

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
	$scope.games = [];
	$scope.mode = "Generating XML";

	var mamepath = path.normalize(__dirname + "/../emulators/mame/mame64.exe");
	var mame = spawn(mamepath, ["-listxml"]);
	var mamexml = "";
	var parser = new xml2js.Parser();

	parser.addListener("end", function(result) {
		$timeout(function() {
			/*$scope.games = _.filter(result.mame.game, function(value) {
				return !value.$.isdevice;
			});
			$scope.games = $scope.games.slice(0, 30);*/
			$scope.mode = "";
		}, 0);
	});
	
	mame.stdout.on("data", function (data) {
		mamexml += data;
	});
	
	mame.stderr.on("data", function (data) {
		console.log("stderr: " + data);
	});
	
	mame.on("close", function (code) {
		console.log("child process exited with code " + code);
		$timeout(function() {
			$scope.mode = "Parsing XML";
			
			$timeout(function() {
				parser.parseString(mamexml);
			}, 0);
		}, 0);
	});
	
	$scope.launchGame = function(game) {
		console.log(mamepath + " " + game.$.name);
	};
}]);
