

function BuySharesDlgCtrl($scope, dialog, $http) {

  // get the offer info

  var offerUrl = "/api/offers/info/" + dialog.options.offerId;
  $http
    .get(offerUrl)
    .success(function (data) {
      $scope.offer = data;
      $scope.offer.sharePrice = (data.amtToRaise / data.numShares).toFixed(2);
      $scope.offer.shareBuysYou = (data.pctOfferingToSell / 100) * (100 / data.numShares);
    });

  //todo add read of current chip data
  $scope.close = function (chipWager) {
    dialog.close(chipWager);
  };
}