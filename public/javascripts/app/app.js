angular.module('soundscry',['soundscry.filters','soundscry.services','soundscry.directives','ui.bootstrap']).
    config(['$routeProvider','$locationProvider',
        function($routeProvider,$locationProvider) {
            $routeProvider.
                when("/",{
                    templateUrl: 'partials/home',
                    controller: HomeCtrl
                }).
                when("/store",{
                    templateUrl: 'partials/store',
                    controller: StoreCtrl
                }).
                when("/cart",{
                    templateUrl: 'partials/cart',
                    controller: CartCtrl
                }).
                when("/about",{
                    templateUrl: 'partials/about',
                    controller: AboutCtrl
                }).
                when("/faq",{
                    templateUrl: 'partials/faq',
                    controller: FaqCtrl
                }).
                otherwise({
                    redirectTo: '/'
                });
            $locationProvider.html5Mode(true);
        }]);
