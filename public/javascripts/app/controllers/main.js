function MainCtrl($http, $scope, $route, $routeParams, $location, $rootScope, $dialog, principal, authority, authService) {
  $scope.$route = $route;
  $scope.$location = $location;
  $scope.$routeParams = $routeParams;
  $scope.user = principal;

  $scope.email = '';
  $scope.password = '';
  $scope.loginMsg = '';
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
        $scope.$broadcast("LoggedIn");

      })
      .error(function (data) {
        $scope.loginMsg = 'Invalid Credentials';
        $rootScope.$broadcast('event:signin-failed');

      })


  }

  $scope.logout = function () {
    $http
      ['delete'](authUrl)
      .success(function () {
        authority.deauthorize();
      });

  }

  // setup signup dialog
  $rootScope.signupopts = {
    backdrop: true,
    keyboard: true,
    backdropClick: true,
    templateUrl: '/partials/signupdlg',
    controller: 'SignUpDlgCtrl'
  }
  $rootScope.openSignUpDialog = function () {
    var d = $dialog.dialog($rootScope.signupopts);
    d.open().then(function (userInfo) {
      console.log(userInfo);
      if (userInfo) {
        $http
          .post('/api/signup', userInfo)
          .success(function (data) {

          })
          .error(function (data) {

          });
      }
    })
  }

}