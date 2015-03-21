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
	var mamepath = path.normalize(__dirname + "/../emulators/mame/mame64.exe");
	var mame = spawn(mamepath, ["-listxml", "19*"]);
	var mamexml = "";
	var parser = new xml2js.Parser();

	parser.addListener("end", function(result) {
		$timeout(function() {
			$scope.games = _.filter(result.mame.game, function(value) {
				return !value.$.isdevice;
			});
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
		parser.parseString(mamexml);
	});
	
	$scope.launchGame = function(game) {
		console.log(mamepath + " " + game.$.name);
	};
}]);
