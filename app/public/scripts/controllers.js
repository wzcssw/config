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

controllers.controller('hospitalsController', ['$scope', 'hospitalHttp', '$state', '$uibModal', '$log', function ($scope, hospitalHttp, $state, $uibModal, $log) {
    "use strict";
    $scope.self = $scope;
    $scope.maxSize = 5;
    hospitalHttp.getHospital({page: 1}, function (data) {
        $scope.hospitals = data.hospitals;
        $scope.current_page = data.current_page;
        $scope.total_count = data.total_count;
        $scope.levels = data.levels;
        $scope.cities = data.cities;
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

    $scope.open = function (size) {
	    var new_hospital = $uibModal.open({
	      animation: $scope.hospitalEnabled,
	      templateUrl: 'new_hospital.html',
	      controller: 'newHospitalController',
	      size: size,
	      resolve: {
	        items: function () {
	          return $scope.items;
	        }
	      }
	    });

    // new_hospital.result.then(function (selectedItem) {
    //   $scope.selected = selectedItem;
    // }, function () {
    //   $log.info('Modal dismissed at: ' + new Date());
    // });
    };
}]);

controllers.controller('newHospitalController', ['$scope', 'hospitalHttp', '$state', '$uibModalInstance', function ($scope, hospitalHttp, $state, $uibModalInstance) {
  $scope.cancel = function () {
    $uibModalInstance.dismiss('cancel');
  };

  $scope.save = function(hospital){	
  	hospitalHttp.createHospital({hospital: hospital}, function (data) {
      console.log(data);
      $uibModalInstance.close();
    });
  };

  hospitalHttp.getHospital({}, function (data) {
      $scope.levels = data.levels;
      $scope.cities = data.cities;
      console.log($scope.cities);
  });
}]);

controllers.controller('projectsController', ['$scope', 'projectHttp', function($scope, projectHttp){
	'use strict';
	$scope.self = $scope;

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
