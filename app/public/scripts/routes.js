var routes = angular.module('routes', ['ui.router']);
routes.config(['$stateProvider', '$urlRouterProvider', function($stateProvider, $urlRouterProvider){
    $stateProvider.state('main', {
        url:'/main',
        templateUrl:'templates/main.html',
        controller:'mainController'
    }).state('login', {
        url:'/login',
        templateUrl:'templates/login.html',
        controller:'loginController'
    }).state('register', {
        url:'/register',
        templateUrl:'templates/register.html',
        controller:'registerController'
    });
    $urlRouterProvider.otherwise('/login');
}]);