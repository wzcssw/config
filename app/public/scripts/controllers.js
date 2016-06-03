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
        });
    }
}]);

controllers.controller('hospitalsController', ['$scope', 'hospitalHttp', '$state', '$uibModal', '$log', function ($scope, hospitalHttp, $state, $uibModal, $log) {
    "use strict";
    $scope.self = $scope;
    $scope.maxSize = 5;
    $scope.city_id = "";
    $scope.q = "";
    
    hospitalHttp.getHospital({}, function (data) {
        $scope.hospitals = data.hospitals;
        $scope.current_page = data.current_page;
        $scope.total_count = data.total_count;
    });
    hospitalHttp.getCityAndLevel({}, function(data){
        $scope.levels = data.levels;
        $scope.cities = data.cities;
    })
    $scope.pageChanged = function () {
        hospitalHttp.getHospital({page: $scope.current_page,q: $scope.q,city_id: $scope.city_id}, function (data) {
            $scope.current_page = data.current_page;
            $scope.hospitals = data.hospitals;
        });
    };
    $scope.setPage = function () {
      $scope.current_page = $('#go_page').val();
      $scope.pageChanged();
      $('#go_page').val("");
    };
    $scope.search = function(){
    	hospitalHttp.getHospital({q: $scope.q, city_id: $scope.city_id}, function (data) {
        $scope.hospitals = data.hospitals;
        $scope.current_page = data.current_page;
        $scope.total_count = data.total_count;
      });
    }
    //打开新建框
    $scope.open_new = function (size) {
    	$scope.items = {
    		levels: $scope.levels,
    		cities: $scope.cities
    	};
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
	    new_hospital.result.then(function(){
        $scope.pageChanged();
      });
    };
    //打开编辑框
    $scope.open_edit = function (size,hospital) {
    	$scope.items = {
    		hospital: hospital,
    		levels: $scope.levels,
    		cities: $scope.cities
    	};
	    var edit_hospital = $uibModal.open({
	      animation: $scope.hospitalEnabled,
	      templateUrl: 'edit_hospital.html',
	      controller: 'editHospitalController',
	      size: size,
	      resolve: {
	        items: function () {
	          return $scope.items;
	        }
	      }
	    });
	    edit_hospital.result.then(function(){
        $scope.pageChanged();
      });
    };
}]);

controllers.controller('newHospitalController', ['$scope', 'hospitalHttp', '$state', '$uibModalInstance', 'items', function ($scope, hospitalHttp, $state, $uibModalInstance, items) {
  $scope.cities = items.cities;
  $scope.levels = items.levels;
  $scope.cancel = function () {
    $uibModalInstance.dismiss('cancel');
  };
  $scope.save = function(hospital){	
  	hospitalHttp.createHospital({hospital: hospital}, function (data) {
      $uibModalInstance.close();
    });
  };
}]);

controllers.controller('editHospitalController', ['$scope', 'hospitalHttp', '$state', '$uibModalInstance', 'items', function ($scope, hospitalHttp, $state, $uibModalInstance, items) {
  $scope.hospital = items.hospital;
  $scope.cities = items.cities;
  $scope.levels = items.levels;
  $scope.hospital.city_id += "";
  var i = 0;
  for(var l in $scope.levels){
  	if(l==$scope.hospital.level){
      $scope.hospital.level = i+"";
  	}
  	i++;
  };
  $scope.cancel = function () {
    $uibModalInstance.dismiss('cancel');
  };
  $scope.save = function(hospital){
  	hospitalHttp.editHospital({hospital: hospital}, function (data) {
      $uibModalInstance.close();
    });
  };
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

	$scope.set_content = function (_id) {
		$scope.select_id = _id;
	}
	$scope.set_content(1);
}]);

controllers.controller('citiesController', ['$scope', 'citiesHttp', function($scope, citiesHttp){
	"use strict";
	$scope.maxSize = 5;
	$scope.current_page = 1;
	$scope.dynamicPopover = {
		templateUrl: 'myPopSelectTemplate.html',
		title: 'Title'
	};
	$scope.city_search = function(){
		citiesHttp.getCities({q:$scope.search_city_name}, function(data){
			$scope.cities = data.cities;
		});
	}
	citiesHttp.getCities({}, function(data){
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
		var params = {};
		switch ($scope.change_type){
			case 'state':
				var state;
				if($scope.placement.selected == "是"){
					state = true;
				}else if($scope.placement.selected == "否"){
					state = false;
				}
				params = {id:$scope.city_id, state:state};
				break;
			case 'maturity':
				var maturity;
				if($scope.placement.selected == "新区"){
					maturity = "newarea";
				}else if($scope.placement.selected == "半成熟区"){
					maturity = "half";
				}else if($scope.placement.selected == "成熟区"){
					maturity = "mature";
				}
				params = {id:$scope.city_id, maturity:maturity};
				break;
		}
		citiesHttp.changeCities(params, function(data){
			if(data.success){
				if($scope.change_type == "state"){
					$scope.city_info.state = params.state;
				}else{
					$scope.city_info.maturity_zh = $scope.placement.selected;
				}
				//$uibTooltipProvider.setTriggers('closeTrigger');
			}
		});
	}
	$scope.input_select = {};
	$scope.input_click = function(){
		var params = {};
		switch ($scope.change_type){
			case 'go_public_sea_day':
				params = {id:$scope.city_id, go_public_sea_day:$scope.input_select.value};
				break;
			case 'develop_coefficient':
				params = {id:$scope.city_id, develop_coefficient:$scope.input_select.value};
				break;
		}
		citiesHttp.changeCities(params, function(data){
			if(data.success){
				if($scope.change_type == "go_public_sea_day"){
					$scope.city_info.go_public_sea_day = $scope.input_select.value;
				}else{
					$scope.city_info.develop_coefficient = $scope.input_select.value;
				}
			}
		});
	}
	$scope.select_click = function(...values){
		$scope.change_type = values[0];
		$scope.city_id = values[2];
		$scope.city_info = values[3];
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
				$scope.input_select.value = values[1];
				break;
			case 'develop_coefficient':
				$scope.dynamicPopover = {
					templateUrl: 'myPopInputTemplate.html',
					title: '设置系数'
				};
				$scope.input_select.value = values[1];
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
