var app = angular.module('myApp', ['ui.bootstrap', 'routes', 'controllers', 'filters','angular-confirm']);
app.run(['$rootScope', '$location', '$state', 'userHttp', function($rootScope, $location, $state, userHttp){
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

    $rootScope.$on('$locationChangeStart', function (event, next, current) {
        console.log(userHttp.isLogin());
        console.log($location.$$path.match('login'));
        if (!userHttp.isLogin() && !$location.$$path.match('login')){
            event.preventDefault();
            $state.go('login');
        }
    });

}]);
