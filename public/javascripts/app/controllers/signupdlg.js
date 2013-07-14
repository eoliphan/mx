function SignUpDlgCtrl($scope, dialog, $http) {
  //todo add read of current chip data
  $scope.close = function (chipWager) {
    dialog.close(chipWager);
  };


}