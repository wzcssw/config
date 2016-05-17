var controllers = angular.module('controllers', ['services', 'directives']);
controllers.controller('loginController', ['$scope', 'userHttp', '$state', function($scope, userHttp, $state){
	userHttp.getUser(function(user){
		"use strict";
		if (user){
			$state.go('main');
		}
	});

	$scope.self = $scope;
	$scope.login = function(){
		"use strict";
		userHttp.login({username: $scope.username, password: $scope.password}, function (data) {
			userHttp.user = data.user;
			location.href = '/';
		});
	}
}]);

controllers.controller('mainController', ['$scope', 'userHttp', function($scope, userHttp){
	$scope.self = $scope;
    $scope.register = function(){
		"use strict";
		userHttp.register({username: $scope.username, password: $scope.password}, function (data) {
			var result = data.result;
			console.log(data);
		});
	}
}]);