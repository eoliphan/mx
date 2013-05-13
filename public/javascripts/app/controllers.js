function MainCtrl($http, $scope, $route, $routeParams, $location, principal, authority, authService) {
    $scope.$route = $route;
    $scope.$location = $location;
    $scope.$routeParams = $routeParams;
    $scope.user = principal;

    $scope.email = '';
    $scope.password = '';
    $scope.loginMsg = ''
    var authUrl = "/api/auth";

    // check for current auth on reload
    $http
        .get(authUrl)
        .success(function (data) {
            // we have a good session
            authService.loginConfirmed();
            authority.authorize(data);

            $scope.email = '';
            $scope.password = '';
            $scope.curUser = data;

        });

    $scope.loginButtonClick = function () {
        var body = {
            email: $scope.email,
            password: $scope.password
        };
        $http
            .post(authUrl, body)
            .success(function (data) {
                authService.loginConfirmed();
                authority.authorize(data);

                $scope.email = '';
                $scope.password = '';
                $scope.curUser = data;

            })
            .error(function (data) {
                $scope.loginMsg = 'Invalid Credentials';
                $rootScope.$broadcast('event:signin-failed');

            })


    }

    $scope.logoutButtonClick = function () {
        $http
            ['delete'](authUrl)
            .success(function () {
                authority.deauthorize();
            });

    }
}

function HomeCtrl() {

}
function StoreCtrl() {

}
function CartCtrl() {

}
function AboutCtrl() {

}
function FaqCtrl() {

}

function ProfileCtrl() {

}

