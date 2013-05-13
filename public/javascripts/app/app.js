angular.module('soundscry',['soundscry.filters','soundscry.services','soundscry.directives','ui.bootstrap','ui.compat','http-auth-interceptor', 'authentication']).
    config(['$stateProvider','$routeProvider','$locationProvider',
        function($stateProvider,$routeProvider,$locationProvider) {
            $stateProvider.
                state("home",{
                    url:"/",
                    templateUrl: 'partials/home',
                    controller: HomeCtrl
                }).
                state("store",{
                    url: "/store",
                    templateUrl: 'partials/store',
                    controller: StoreCtrl
                }).
                state("cart",{
                    url:"/cart",
                    templateUrl: 'partials/cart',
                    controller: CartCtrl
                }).
                state("about",{
                    url:"/about",
                    templateUrl: 'partials/about',
                    controller: AboutCtrl
                }).
                state("faq",{
                    url:"/faq",
                    templateUrl: 'partials/faq',
                    controller: FaqCtrl
                }).
                state("artistinfo",{
                    url:"/artistinfo",
                    templateUrl: 'partials/artistinfo'
                    //controller: FaqCtrl
                }).
                state("musicloverinfo",{
                    url:"/musicloverinfo",
                    templateUrl: 'partials/musicloverinfo'
                    //controller: FaqCtrl
                }).
                state("investorinfo",{
                    url:"/investorinfo",
                    templateUrl: 'partials/investorinfo'
                    //controller: FaqCtrl
                }).
                state("profile",{
                    url:"/profile",
                    templateUrl: 'partials/profile'
                    //controller: FaqCtrl
                });;
            $locationProvider.html5Mode(true);
        }]).run(
          [        '$rootScope', '$state', '$stateParams',
          function ($rootScope,   $state,   $stateParams) {
            $rootScope.$state = $state;
            $rootScope.$stateParams = $stateParams;
          }]);
