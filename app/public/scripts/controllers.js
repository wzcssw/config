var controllers = angular.module('controllers', ['services', 'directives']);
controllers.controller('loginController', ['$scope', 'userHttp', '$state', function($scope, userHttp, $state){
	$scope.isShow = false;
	$scope.self = $scope;
	//userHttp.getUser(function(user){
	//	"use strict";
	//	if (user){
	//		$state.go('hospital');
	//	}else {
	//		$scope.isShow = true;
	//	}
	//});

	if (userHttp.isLogin()){
		$state.go('hospital');
		return ;
	}else {
		$scope.isShow = true;
	}

	$scope.login = function(){
		"use strict";
		userHttp.login({username: $scope.username, password: $scope.password}, function (data) {
			userHttp.user = data.user;
			location.href = '/';
		});
	};
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

controllers.controller('hospitalController', ['$scope', 'userHttp', '$state', function($scope, userHttp, $state){
	"use strict";
	$scope.self = $scope;
	$scope.maxSize = 5;
	userHttp.getHospital({},function(data){
	  $scope.hospitals = JSON.parse(data.hospitals);
	  $scope.current_page = data.current_page;
	  $scope.total_count = data.total_count; 
	  console.log($scope.total_count);
	});
	$scope.pageChanged = function(){
    userHttp.getHospital({page: $scope.current_page},function(data){
		  $scope.current_page = data.current_page;	  
      $scope.hospitals = JSON.parse(data.hospitals);
		});
	};

  $scope.setPage = function () {
    $scope.current_page = $('#go_page').val();
    $scope.pageChanged();
    $('#go_page').val("");
  }; 

}]);

controllers.controller('createHospitalController', ['$scope', '$state', 'userHttp', function($scope, $state, userHttp){
  $scope.self = $scope;
  'use strict'; 
}]);


