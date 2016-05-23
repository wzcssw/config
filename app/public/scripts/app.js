var app = angular.module('myApp', ['ui.bootstrap', 'routes', 'controllers', 'filters']);
app.run(['$rootScope', '$location', 'userHttp', function($rootScope, $location, userHttp){
    $rootScope.logout = function(){
        "use strict";
        userHttp.logout(function(){
            console.log('logout success');
            location.href = '/';
        });
    };

    $rootScope.isActive = function (viewLocation) {
        return viewLocation === $location.path();
    };
}]);