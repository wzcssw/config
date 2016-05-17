var app = angular.module('myApp', ['ui.bootstrap', 'routes', 'controllers', 'filters']);
app.run(['$rootScope', 'userHttp', function($rootScope, userHttp){
    $rootScope.logout = function(){
        "use strict";
        userHttp.logout(function(){
            console.log('logout success');
            location.href = '/';
        })
    }
}]);