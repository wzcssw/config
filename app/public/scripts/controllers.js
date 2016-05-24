var controllers = angular.module('controllers', ['services', 'directives']);
controllers.controller('loginController', ['$scope', 'userHttp', '$state', function($scope, userHttp, $state){
	$scope.isShow = false;
	$scope.self = $scope;
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
    $scope.$watch('typeChoiceConfig.selected', function(newValue){
        $scope.getProjectInfo();
    });

    $scope.searchClick = function(){
        $scope.getProjectInfo();
    };

	$scope.getProjectInfo = function(page){
        page = page || 1;
		projectHttp.getProjects({page: page, categoryZh: $scope.typeChoiceConfig.selected, q: $scope.search},function(data){
			$scope.projectInfo = data.result;
		});
	};
	$scope.getProjectInfo();

	$scope.pageChanged = function(){
		$scope.getProjectInfo($scope.projectInfo.current_page);
	}

}]);

controllers.controller('citiesController', ['$scope', 'citiesHttp', function($scope, citiesHttp){
	"use strict";
	$scope.maxSize = 5;
	$scope.current_page = 1;
	$scope.dynamicPopover = {
		templateUrl: 'myPopSelectTemplate.html',
		title: 'Title'
	};
	citiesHttp.getCities({}, function(data){
		console.log(data);
		$scope.cities = data.cities;
		$scope.total_count = data.total_count;
	});
	$scope.pageChanged = function(){
		citiesHttp.getCities({page:$scope.current_page}, function(data){
			$scope.cities = data.cities;
		});
	}
	$scope.setPage = function(){
		citiesHttp.getCities({page:$scope.current_page}, function(data){
			$scope.cities = data.cities;
		});
	}
	$scope.select_change = function(){
		console.log($scope.placement.selected);
	}
	$scope.input_change = function(){
		console.log(11);
	}
	$scope.select_click = function(...values){
		switch (values[0]){
			case 'state':
				$scope.dynamicPopover = {
					templateUrl: 'myPopSelectTemplate.html',
					title: '选择状态'
				};
				$scope.placement = {
					options: [
						'是',
						'否'
					],
					selected: values[1]?'是':'否'
				}
				break;
			case 'go_public_sea_day':
				$scope.dynamicPopover = {
					templateUrl: 'myPopInputTemplate.html',
					title: '设置天数'
				};
				$scope.input_select = values[1];
				break;
			case 'develop_coefficient':
				$scope.dynamicPopover = {
					templateUrl: 'myPopInputTemplate.html',
					title: '设置系数'
				};
				$scope.input_select = values[1];
				break;
			case 'maturity':
				$scope.dynamicPopover = {
					templateUrl: 'myPopSelectTemplate.html',
					title: '设置成熟度'
				};
				$scope.placement = {
					options: [
						'新区',
						'半成熟区',
						'成熟区'
					],
					selected: values[1]
				}
				break;
		}
	}
}]);
