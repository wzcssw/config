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
		$state.go('hospitals');
		return ;
	}else {
		$scope.isShow = true;
	}

    $scope.login = function () {
        "use strict";
        userHttp.login({username: $scope.username, password: $scope.password}, function (data) {
            userHttp.user = data.user;
            location.href = '/';
        });
    };
}]);

controllers.controller('mainController', ['$scope', 'userHttp', function ($scope, userHttp) {
    $scope.self = $scope;
    $scope.register = function () {
        "use strict";
        userHttp.register({username: $scope.username, password: $scope.password}, function (data) {
            var result = data.result;
            console.log(data);
        });
    }
}]);

controllers.controller('hospitalsController', ['$scope', 'hospitalHttp', '$state', function ($scope, hospitalHttp, $state) {
    "use strict";
    $scope.self = $scope;
    $scope.maxSize = 5;
    hospitalHttp.getHospital({}, function (data) {
        $scope.hospitals = data.hospitals;
        $scope.current_page = data.current_page;
        $scope.total_count = data.total_count;
        console.log($scope.total_count);
    });
    $scope.pageChanged = function () {
        hospitalHttp.getHospital({page: $scope.current_page}, function (data) {
            $scope.current_page = data.current_page;
            $scope.hospitals = data.hospitals;
        });
    };

    $scope.setPage = function () {
        $scope.current_page = $('#go_page').val();
        $scope.pageChanged();
        $('#go_page').val("");
    };

}]);

controllers.controller('createHospitalController', ['$scope', '$state', 'userHttp', function ($scope, $state, userHttp) {
    $scope.self = $scope;
    'use strict';
}]);

controllers.controller('projectsController', ['$scope', 'projectHttp', function($scope, projectHttp){
	'use strict';
	$scope.self = $scope;
    $scope.typeChoiceConfig = {
        options: [
            '全部',
            '检查',
            '检验'
        ],
        selected: '全部'
    };

	$scope.getProjectInfo = function(page){
		projectHttp.getProjects({page: page},function(data){
			$scope.projectInfo = data.result;
			console.log(data.result);
		});
	};
	$scope.getProjectInfo();

	$scope.pageChanged = function(){
		$scope.getProjectInfo($scope.projectInfo.current_page);
	}

}]);

