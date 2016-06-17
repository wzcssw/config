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
            console.log(data.user);
            location.href = '/';
        }, function(){
			alert('验证错误');
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

controllers.controller('hospitalsController', ['$scope', 'hospitalHttp', '$state', '$log', '$uibModal', function ($scope, hospitalHttp, $state, $log, $uibModal) {
    "use strict";
    $scope.self = $scope;
    $scope.maxSize = 5;
    $scope.city_id = "";
    $scope.q = "";
    $scope.hospitalEnabled = true;
    hospitalHttp.getHospital({}, function (data) {
        $scope.hospitals = data.hospitals;
        $scope.current_page = data.current_page;
        $scope.total_count = data.total_count;
    });
    hospitalHttp.getOptionAttr({}, function(data){
        $scope.levels = data.levels;
        $scope.cities = data.cities;
        $scope.natures = data.natures;
        $scope.projects = data.projects;
        $scope.device_states = data.device_states;
    });
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
    		cities: $scope.cities,
    		natures: $scope.natures
    	};
	    var new_hospital = $uibModal.open({
	      animation: $scope.hospitalEnabled,
	      templateUrl: 'new_hospital.html',
	      controller: function($scope, $uibModalInstance, items){
                  $scope.cities = items.cities;
				  $scope.levels = items.levels;
				  $scope.natures = items.natures;
				  $scope.cancel = function () {
				    $uibModalInstance.dismiss('cancel');
				  };
				  $scope.save = function(hospital){
				  	hospitalHttp.createHospital({hospital: hospital}, function (data) {
				      $uibModalInstance.close();
				    });
				  };
	      },
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
    		cities: $scope.cities,
    		natures: $scope.natures
    	};
	    var edit_hospital = $uibModal.open({
	      animation: $scope.hospitalEnabled,
	      templateUrl: 'edit_hospital.html',
	      controller: function($scope, $uibModalInstance, items){
                  $scope.hospital = items.hospital;
				  $scope.cities = items.cities;
				  $scope.levels = items.levels;
				  $scope.natures = items.natures;
				  $scope.hospital.city_id += "";
				  var i = 0;
				  var j = 0;
				  for(var l in $scope.levels){
				  	if(l==$scope.hospital.level){
				      $scope.hospital.level = i+"";
				  	}
				  	i++;
				  };
				  for(var n in $scope.natures){
				  	if(n==$scope.hospital.nature){
				      $scope.hospital.nature = j+"";
				  	}
				  	j++;
				  };
				  $scope.cancel = function () {
				    $uibModalInstance.dismiss('cancel');
				  };
				  $scope.save = function(hospital){
				  	hospitalHttp.editHospital({hospital: hospital}, function (data) {
				      $uibModalInstance.close();
				    });
				  };
	      },
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

    $scope.open_device = function (size,hospital) {
    	$scope.items = {
    		hospital: hospital,
    		projects: $scope.projects,
    		device_states: $scope.device_states
    	};
	    var device_hospital = $uibModal.open({
	      animation: $scope.hospitalEnabled,
	      templateUrl: 'device_hospital.html',
	      controller: function($scope, $uibModalInstance, items){
  	      $scope.hospital = items.hospital;
  	      hospitalHttp.getHospitalDevice({hospital_id: hospital.id}, function(data){
              $scope.dic_hospital_device = data.dic_hospital_device.dic_hospital_device;
              angular.forEach($scope.dic_hospital_device,function(object,index){
                object.id+='';
                object.device_state+='';
              });
  	      });
  	      $scope.projects = items.projects;
  	      $scope.device_states = items.device_states;
				  $scope.cancel = function () {
				    $uibModalInstance.dismiss('cancel');
				  };
				  $scope.save = function(){
				  	console.log($scope.dic_hospital_device);
				  	hospitalHttp.saveHospitalDevice({hospital_id: $scope.hospital.id, dic_hospital_device: $scope.dic_hospital_device}, function(data){
              console.log(data);
				  	})
				  	$uibModalInstance.dismiss('cancel');
				  };
				  $scope.add_device_row = function(){
            $scope.dic_hospital_device.push({
            	id: "",
	  	      	name: "",
	  	      	device_state: ""
            });
				  };
				  $scope.delete_row = function(tr_num){
				  	$scope.dic_hospital_device.splice(tr_num, 1);
				  	// console.log($scope.dic_hospital_device);
				  }
	      },
	      size: size,
	      resolve: {
	        items: function () {
	          return $scope.items;
	        }
	      }
	    });
	    device_hospital.result.then(function(){
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

controllers.controller('bodiesController', ['$scope', 'bodiesHttp', '$state', '$uibModal', function ($scope, bodiesHttp, $state, $uibModal) {
	"use strict";
	$scope.self = $scope;
	$scope.maxSize = 5;
	$scope.q = "";

	bodiesHttp.getBody({}, function (data) {
			$scope.bodies = data.bodies;
			$scope.current_page = data.current_page;
			$scope.total_count = data.total_count;
	});
	bodiesHttp.getCategory({}, function (data) {
			$scope.categories = data.categories;
	});
	$scope.pageChanged = function () {
			bodiesHttp.getBody({page: $scope.current_page,q: $scope.q, category_id: $scope.category_id}, function (data) {
					$scope.current_page = data.current_page;
					$scope.bodies = data.bodies;
			});
	};
	$scope.setPage = function () {
		$scope.current_page = $('#go_page').val();
		$scope.pageChanged();
		$('#go_page').val("");
	};
	$scope.search = function(){
		bodiesHttp.getBody({q: $scope.q, category_id: $scope.category_id}, function (data) {
			$scope.bodies = data.bodies;
			$scope.current_page = data.current_page;
			$scope.total_count = data.total_count;
		});
	};
	$scope.delete = function(_id){
		bodiesHttp.deleteBody({id: _id}, function (data) {
			$scope.pageChanged();
		});
	};
	$scope.update = function(_body){
		$scope.items = {
			categories: $scope.categories,
			body: _body
		};
		var body_modal = $uibModal.open({
			templateUrl: 'update_bodies.html',
			controller: 'updateBodyController',
			size: 'sm',
			resolve: {
				items: function () {
					return $scope.items;
				}
			}
		});
		body_modal.result.then(function(){
			$scope.pageChanged();
		});
	};

	//打开新建框
	$scope.open_new = function (size) {
		$scope.items = {
			categories: $scope.categories
		};
		var new_hospital = $uibModal.open({
			animation: $scope.hospitalEnabled,
			templateUrl: 'new_bodies.html',
			controller: 'newBodiesController',
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
}]);

controllers.controller('newBodiesController', ['$scope', 'bodiesHttp', '$state', '$uibModalInstance', 'items', function ($scope, bodiesHttp, $state, $uibModalInstance, items) {
	$scope.categories = items.categories;
	$scope.cancel = function () {
		$uibModalInstance.dismiss('cancel');
	};
	$scope.save = function(body){
		bodiesHttp.createBody({body: body}, function (data) {
			$uibModalInstance.close();
		});
	};
}]);

controllers.controller('updateBodyController', ['$scope', 'bodiesHttp', '$state', '$uibModalInstance', 'items', function ($scope, bodiesHttp, $state, $uibModalInstance, items) {
	$scope.categories = items.categories;
	items.body.category_id = items.body.category_id + "";
	$scope.body = items.body;
	$scope.cancel = function () {
		$uibModalInstance.dismiss('cancel');
	};
	$scope.save = function(_body){
		console.log(_body);
		bodiesHttp.updateBody({body: _body}, function (data) {
			$uibModalInstance.close();
		});
	};
}]);

controllers.controller('operationlogsController', ['$scope', 'operationlogsHttp', function($scope, operationlogsHttp){
	"use strict";
	$scope.self = $scope;
	$scope.maxSize = 5;
	$scope.current_page = 1;

	operationlogsHttp.getOperationlogs({}, function(data){
		$scope.operation_logs = data.result.operation_logs;
		$scope.total_count = data.result.total_count;
		$scope.current_page = data.result.current_page;
	});

	operationlogsHttp.getOperationlogtypes({}, function(data){
		$scope.operation_log_types = data.result.operation_log_types;
	});

	$scope.search = function(){
		operationlogsHttp.getOperationlogs({operation_log_type_id: $scope.operation_log_type,user_realname: $scope.user_realname, keyword: $scope.keyword,start_time: $scope.start_time,end_time: $scope.end_time}, function (data) {
			$scope.operation_logs = data.result.operation_logs;
			$scope.total_count = data.result.total_count;
			$scope.current_page = data.result.current_page;
		});
	}

	$scope.refresh = function(){
		$scope.operation_log_type = '';
		$scope.user_realname = "";
		$scope.keyword = "";
		$scope.start_time = "";
		$scope.end_time = "";
		operationlogsHttp.getOperationlogs({}, function(data){
			$scope.operation_logs = data.result.operation_logs;
			$scope.total_count = data.result.total_count;
			$scope.current_page = data.result.current_page;
		});
	}

	$scope.pageChanged = function(){
		operationlogsHttp.getOperationlogs({page:$scope.current_page}, function(data){
			$scope.operation_logs = data.result.operation_logs;
		});
	}

	$scope.setPage = function(){
		operationlogsHttp.getOperationlogs({page:$scope.current_page}, function(data){
			$scope.operation_logs = data.result.operation_logs;
		});
	}
}]);

controllers.controller('categoriesController', ['$scope', 'categoriesHttp','$uibModal', function($scope, categoriesHttp,$uibModal){
	"use strict";
	$scope.self = $scope;

	categoriesHttp.getCategories({}, function(data){
		$scope.categories = data.categories;
	});

	$scope.delete = function(_id){
		categoriesHttp.deleteCategory({id: _id}, function (data) {
			categoriesHttp.getCategories({}, function(data){
				$scope.categories = data.categories;
			});
		});
	};

	//打开新建框
	$scope.open_new = function (size) {
			var new_category = $uibModal.open({
				// animation: $scope.hospitalEnabled,
				templateUrl: 'new_categories.html',
				controller: 'newCategoriesController',
				size: size
			});
			new_category.result.then(function(){
						categoriesHttp.getCategories({}, function(data){
							$scope.categories = data.categories;
						});
		      });
		};
	}
]);
controllers.controller('newCategoriesController', ['$scope', 'categoriesHttp', '$state', '$uibModalInstance', function ($scope, categoriesHttp, $state, $uibModalInstance) {
	$scope.category = {};
	$scope.cancel = function () {
		$uibModalInstance.dismiss('cancel');
	};
	$scope.save = function(category){
		categoriesHttp.createCategory({category: $scope.category}, function (data) {
			$uibModalInstance.close();
		});
	};
}]);
