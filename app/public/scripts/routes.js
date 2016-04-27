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
    }).state('register', {
        url:'/register',
        templateUrl:'templates/register.html',
        controller:'registerController'
    }).state('photo', {
        url:'/photo',
        templateUrl:'templates/photo.html',
        controller:'photoController'
    });
     $urlRouterProvider.otherwise('/login');
}]);