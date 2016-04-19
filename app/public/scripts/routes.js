var routes = angular.module('routes', ['ui.router']);
routes.config(['$stateProvider', '$urlRouterProvider', function($stateProvider, $urlRouterProvider){
	console.log('111');
    $stateProvider.state('test', {
        url:'/test',
        templateUrl:'templates/test.html',
        controller:'testController'
    }).state('login', {
        url:'/login',
        templateUrl:'templates/login.html',
        controller:'loginController'
    });
     $urlRouterProvider.otherwise('/login');
}]);