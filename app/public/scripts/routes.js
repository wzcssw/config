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
    }).state('new_hospital', {
        url:'/new_hospital',
        templateUrl:'templates/new_hospital.html',
        controller:'newHospitalController'
    }).state('projects', {
        url:'/projects',
        templateUrl:'templates/projects.html',
        controller:'projectsController'
    }).state('cities',{
        url:'/cities',
        templateUrl:'templates/cities.html',
        controller:'citiesController'
    }).state('bodies',{
        url:'/bodies',
        templateUrl:'templates/bodies.html',
        controller:'bodiesController'
    });
    $urlRouterProvider.otherwise('/login');
}]);
