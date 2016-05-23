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
    }).state('hospitals', {
        url:'/hospitals',
        templateUrl:'templates/hospitals.html',
        controller:'hospitalsController'
    }).state('projects', {
        url:'/projects',
        templateUrl:'templates/projects.html',
        controller:'projectsController'
    });
    $urlRouterProvider.otherwise('/login');
}]);