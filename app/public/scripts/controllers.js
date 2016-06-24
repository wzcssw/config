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

controllers.controller('dicHospitalsController', ['$scope', 'dic_hospitalHttp', '$state', '$log', '$uibModal', function ($scope, dic_hospitalHttp, $state, $log, $uibModal) {
    "use strict";
    $scope.self = $scope;
    $scope.maxSize = 5;
    $scope.city_id = "";
    $scope.q = "";
    $scope.hospitalEnabled = true;
    dic_hospitalHttp.getHospital({}, function (data) {
        $scope.hospitals = data.hospitals;
        $scope.current_page = data.current_page;
        $scope.total_count = data.total_count;
    });
    dic_hospitalHttp.getOptionAttr({}, function(data){
        $scope.levels = data.levels;
        $scope.cities = data.cities;
        $scope.natures = data.natures;
        $scope.projects = data.projects;
        $scope.device_states = data.device_states;
    });
    $scope.pageChanged = function () {
        dic_hospitalHttp.getHospital({page: $scope.current_page,q: $scope.q,city_id: $scope.city_id}, function (data) {
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
    	dic_hospitalHttp.getHospital({q: $scope.q, city_id: $scope.city_id}, function (data) {
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
				  	dic_hospitalHttp.createHospital({hospital: hospital}, function (data) {
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
				  	dic_hospitalHttp.editHospital({hospital: hospital}, function (data) {
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
  	      dic_hospitalHttp.getHospitalDevice({hospital_id: hospital.id}, function(data){
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
				  	dic_hospitalHttp.saveHospitalDevice({hospital_id: $scope.hospital.id, dic_hospital_device: $scope.dic_hospital_device}, function(data){
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

	$scope.add_project = function(body){
		$scope.items = {
			body_id: body.id,
			category_id: body.category_id,
			project_zh: body.projects
		};
		var projects_modal = $uibModal.open({
			templateUrl: 'add_project.html',
			controller: 'addProjectToBodyController',
			size: 'lg',
			resolve: {
				items: function () {
					return $scope.items;
				}
			}
		});
		projects_modal.result.then(function(){
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

controllers.controller('addProjectToBodyController', ['$scope', 'bodiesHttp','projectHttp', '$state', '$uibModalInstance', 'items', function ($scope, bodiesHttp, projectHttp, $state, $uibModalInstance, items) {
	$scope.items = items;
	projectHttp.getProjects({category_id: items.category_id},function(data){
		$scope.projects = data.result.projects;
	});
	$scope.contains = function(arr, obj,_this) {
	    var i = arr.length;
	    while (i--) {
	        if (arr[i] === obj) {
	            return true;
	        }
	    }
	    return false;
	}
	$scope.cancel = function () {
		$uibModalInstance.dismiss('cancel');
	};
	$scope.save = function(){
		project_ids = [];
		angular.forEach($scope.projects, function(object,index){
			if(object.isChecked){
				project_ids.push(object.id)
			}
		});
		bodiesHttp.addProjectToBody({body_id:items.body_id,project_ids:project_ids},function (data) {
		  $uibModalInstance.dismiss('cancel');
			$state.reload();
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

	$scope.select_flag = function (category) {
		//  select_click
		$scope.dynamicPopover = {
			templateUrl: 'myPopSelectTemplate.html',
			title: '是否开启'
		};
		$scope.placement = {
			options: [
				'是',
				'否'
			],
			selected: category.flag?'是':'否'
		}
		$scope.category = category;
	}

	$scope.flag_change = function () {
		var category = $scope.category;
		if($scope.placement.selected == "是"){
			category.flag = true;
		}else if($scope.placement.selected == "否"){
			category.flag  = false;
		}
		categoriesHttp.updateCategory({category:category}, function(data){
		});
	}

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
	$scope.update = function (category) {
			var new_category = $uibModal.open({
				templateUrl: 'update_categories.html',
				controller: 'updateCategoriesController',
				size: 'sm',
				resolve: {
					items: function () {
						return category;
					}
				}
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

controllers.controller('updateCategoriesController', ['$scope', 'categoriesHttp', '$state', '$uibModalInstance','items', function ($scope, categoriesHttp, $state, $uibModalInstance,items) {
	$scope.category = items;
	$scope.cancel = function () {
		$uibModalInstance.dismiss('cancel');
	};
	$scope.save = function(category){
		categoriesHttp.updateCategory({category: $scope.category}, function (data) {
			$uibModalInstance.close();
		});
	};
}]);

controllers.controller('bodyModesController', ['$scope', 'bodyModesHttp', 'categoriesHttp', '$uibModal', function($scope, bodyModesHttp, categoriesHttp, $uibModal){
	"use strict";
	$scope.self = $scope;
	$scope.maxSize = 5;
	$scope.category_id = '';
	$scope.q = '';
	bodyModesHttp.getBodyModes({}, function(data){
      $scope.body_modes = data.body_modes;
      $scope.total_count = data.total_count;
      $scope.current_page = data.current_page;
	});

	categoriesHttp.getCategories({}, function(data){
      $scope.categories = data.categories;
	})

	$scope.pageChanged = function(){
		bodyModesHttp.getBodyModes({page:$scope.current_page}, function(data){
			$scope.body_modes = data.body_modes;
		});
	}

	$scope.setPage = function(){
	  $scope.current_page = $('#go_page').val();
      $scope.pageChanged();
      $('#go_page').val("");
	}

	$scope.search = function(){
    	bodyModesHttp.getBodyModes({q: $scope.q, category_id: $scope.category_id}, function (data) {
        $scope.body_modes = data.body_modes;
        $scope.current_page = data.current_page;
        $scope.total_count = data.total_count;
      });
    }

    $scope.open_edit = function(size,body_mode){
        $scope.items = {
        	body_mode: body_mode
        }
        var edit_body_mode = $uibModal.open({
          animation: true,
          templateUrl: 'edit_body_mode.html',
          controller: function($scope, $uibModalInstance, items){
            $scope.body_mode = items.body_mode;
            $scope.cancel = function () {
            	$uibModalInstance.dismiss('cancel');
		    };
		    $scope.save = function(body_mode){
			  	bodyModesHttp.editBodyModes({body_mode: body_mode}, function (data) {
			      $uibModalInstance.close();
			    });
		    };
          },
          size:size,
          resolve:{
            items: function(){
            	return $scope.items;
            }
          }
        });
        edit_body_mode.result.then(function(){
          $scope.pageChanged();
        });
    }

    $scope.open_rank = function(size,body_mode){
        $scope.items = {
        	body_mode: body_mode
        }
        var edit_rank = $uibModal.open({
          animation: true,
          templateUrl: 'edit_rank.html',
          controller: function($scope, $uibModalInstance, items){
            $scope.body_mode = items.body_mode;
            $scope.cancel = function () {
            	$uibModalInstance.dismiss('cancel');
		    		};
				    $scope.save = function(body_mode){
					  	bodyModesHttp.editRank({body_mode: body_mode}, function (data) {
					      $uibModalInstance.close();
					    });
				    };
          },
          size:size,
          resolve:{
            items: function(){
            	return $scope.items;
            }
          }
        });
        edit_rank.result.then(function(){
          $scope.pageChanged();
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
    };
    $scope.open_hospital_project = function(size,id){
    	$scope.items = {
        	hospital_id: id
        }
        var hospital_project = $uibModal.open({
          animation: true,
          templateUrl: 'hospital_project.html',
          controller: function($scope, $uibModalInstance, items){
            $scope.getHospitalProject = function(){
          	  hospitalHttp.getHospitalProjects({hospital_id: items.hospital_id}, function (data) {
		        $scope.projects = data.projects;
	          });
            };
		    $scope.cancel = function () {
	          $uibModalInstance.dismiss('cancel');
			};
			$scope.change_status = function(project){
              hospitalHttp.editHospitalProjects({id:project.id,status: project.status, field: 'status'}, function(data){
                $scope.getHospitalProject();
              })
			};
			$scope.change_mbf = function(project){
              hospitalHttp.editHospitalProjects({id:project.id,mbf: project.mbf, field: 'mbf'}, function(data){
			    $scope.getHospitalProject();
			  });
			};
			$scope.getHospitalProject();
          },
          size:size,
          resolve:{
            items: function(){
            	return $scope.items;
            }
          }
        });
        hospital_project.result.then(function(){
          $scope.pageChanged();
        });
    }
    $scope.open_detail = function(hospital){
			var new_modal = $uibModal.open({
				templateUrl: 'hospital_detail.html',
				controller: 'hospitalDetailController',
				size: 'lg',
				resolve: {
					items: function () {
						return hospital;
					}
				}
			});
    }

    $scope.open_assistant = function(hospital){
			var new_modal = $uibModal.open({
				templateUrl: 'assistants_detail.html',
				controller: 'assistantsDetailController',
				size: 'lg',
				resolve: {
					items: function () {
						return hospital;
					}
				}
			});
    }

}]);

controllers.controller('hospitalDetailController', ['hospitalHttp','$scope', '$state', '$uibModalInstance','items', function (hospitalHttp,$scope, $state, $uibModalInstance,items) {
	$scope.hospital = items;
	$scope.category = {};
	$scope.lnglat = items.lng + "," + items.lat;
	$scope.$watch('lnglat', function(newValue, oldValue) {
			var strs = newValue.split(",");
			$scope.hospital.lng = strs[0];
			$scope.hospital.lat = strs[1];
		},true);
	$scope.map_src = "http://restapi.amap.com/v3/staticmap?markers=mid,0xFF0000,A:"+items.lng+","+items.lat+"&key=9c9644d7b9d2f53e6d77449129f411cd&zoom=17&size=570*492";
	$scope.cancel = function () {
		$uibModalInstance.dismiss('cancel');
	};
	$scope.save = function(hospital){
		hospitalHttp.editHospital({hospital: hospital}, function (data) {
			$state.reload();
			$uibModalInstance.dismiss('cancel');
		});
	};
}]);

controllers.controller('assistantsDetailController', ['$scope', 'hospitalHttp', '$state', '$uibModalInstance','items', function ($scope, hospitalHttp, $state, $uibModalInstance,items) {
	$scope.hospital = items;
	$scope.add_assistant_row = function(){
		$scope.hospital.hospital_assistants.push({
			id: "",
			name: ""
		});
	};
	$scope.cancel = function () {
		$uibModalInstance.dismiss('cancel');
		$state.reload();
	};
	$scope.save = function(category){
	};

	$scope.delete_click = function (assistant) {
		hospitalHttp.deleteHospitalAssistants({id: assistant.id}, function (data) {
			$state.reload();
			$uibModalInstance.dismiss('cancel');
		});
	};

	$scope.add_click = function (assistant,hospital_id) {
		assistant.hospital_id = hospital_id;
		hospitalHttp.addHospitalAssistants({assistant: assistant}, function (data) {
			$state.reload();
			$uibModalInstance.dismiss('cancel');
		});
	};
	$scope.select_click = function (state,assistant) {
		$scope.modal_template = {};
		switch (state) {
			case 'name':
				$scope.dynamicPopover = {
					templateUrl: 'myPopInputTemplate.html',
					title: '人员姓名'
				};
				$scope.input_click = function () {
					assistant.name = $scope.modal_template.value;
					hospitalHttp.editHospitalAssistants({hospital_assistant: assistant}, function (data) {
		      });
				};
			break;
			case 'phone':
				$scope.dynamicPopover = {
					templateUrl: 'myPopInputTemplate.html',
					title: '手机号码'
				};
				$scope.input_click = function () {
					assistant.phone = $scope.modal_template.value;
					hospitalHttp.editHospitalAssistants({hospital_assistant: assistant}, function (data) {
		      });
				};
			break;
			case 'address':
				$scope.dynamicPopover = {
					templateUrl: 'myPopInputTemplate.html',
					title: '地址'
				};
				$scope.input_click = function () {
					assistant.address = $scope.modal_template.value;
					hospitalHttp.editHospitalAssistants({hospital_assistant: assistant}, function (data) {
		      });
				};
			break;
			case 'state':
				$scope.dynamicPopover = {
					templateUrl: 'myPopSelectTemplate.html',
					title: '是否接收短信'
				};
				$scope.select_change = function () {
					assistant.state = $scope.modal_template.selected;
					hospitalHttp.editHospitalAssistants({hospital_assistant: assistant}, function (data) {
		      });
				};
			break;
			case 'remark':
				$scope.dynamicPopover = {
					templateUrl: 'myPopInputTemplate.html',
					title: '备注'
				};
				$scope.input_click = function () {
					assistant.remark = $scope.modal_template.value;
					hospitalHttp.editHospitalAssistants({hospital_assistant: assistant}, function (data) {

		      });
				};
			break;
			default:
			break;
		}
	};
}]);
