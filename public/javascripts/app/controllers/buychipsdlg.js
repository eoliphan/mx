
function BuyChipsDlgCtrl($scope, dialog) {

  //todo add read of current chip data
  $scope.close = function (chipWager) {
    dialog.close(chipWager);
  };
}