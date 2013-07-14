/**
 * Controller for album page
 *
 * @todo this controller contains cut-and-pasted Jqery that needs refactoring
 * @param $http
 * @param $scope
 * @param $stateParams
 * @param $state
 * @constructor
 */
function AlbumCtrl($http, $scope, $stateParams, $state, $dialog, socket) {


  var albumId = $stateParams.albumId;

  $http
    .get('/api/album/' + albumId)
    .success(function (data) {
      $scope.albumInfo = data;
      // format price and releasedate


    })
  //todo: bind to model
  $scope.rate = 3;
  $scope.buychipsopts = {
    backdrop: true,
    keyboard: true,
    backdropClick: true,
    templateUrl: '/partials/buychipsdlg', // OR: templateUrl: 'path/to/view.html',
    controller: 'BuyChipsDlgCtrl'
  }
  $scope.openBuyChipsDialog = function () {

    var d = $dialog.dialog($scope.buychipsopts);
    d.open().then(function (chipsPurchased) {
      if (chipsPurchased) {
        console.log(chipsPurchased);
      } else {
        return;
      }
      var command = {
        itemId: albumId,
        itemType: "album",
        chipCount: chipsPurchased,
        name: $scope.albumInfo.albums.name
      };
      $http
        .post('/api/wagers', command)
        .success(function (data) {
          console.log(data);

        })
        .error(function (data) {

        });
    });
  };
  $scope.buysharesopts = {
    backdrop: true,
    keyboard: true,
    backdropClick: true,
    templateUrl: '/partials/buysharesdlg', // OR: templateUrl: 'path/to/view.html',
    controller: 'BuySharesDlgCtrl'
  }

  $scope.openBuySharesDialog = function () {
    var opts = $scope.buysharesopts; //todo: copy?
//        opts.resolve = {
//            offerId: $scope.albumInfo.albums.offerId
//
//        }
    opts.offerId = $scope.albumInfo.albums.offerId;
    var d = $dialog.dialog(opts);
    d.open().then(function (sharesPurchased) {
      if (sharesPurchased) {
        console.log(sharesPurchased);
      } else {
        return;
      }
      var data = {
        sharesPurchased: sharesPurchased
      }
      $http
        .post("/api/offers/investments/" + $scope.albumInfo.albums.offerId, data)
        .success(function (data) {
          console.log(data);

        })
        .error(function (data) {

        });
    });
  };

  //todo: Legacy JQuery for conversion
  //-------------------------------
  $('#sharesPurchased').kendoNumericTextBox({min: 0});
  $('#chipsPurchased').kendoNumericTextBox({min: 0});
  socket.on('investmentAddedToOffer', function (data) {
    /*setTimeout(function(){
     checkCart();
     },250);*/
    alert("Shares purchased");
    $('#buySharesModal').modal('hide');

  });
  socket.on('chipWagerCreated', function (data) {
    alert("Wager placed on album");
  });

  $('#addToCart').click(function () {
    //var formData = $('#investorInfoForm').serialize();
    //var id = $("#uid").val();
    var newUuid = uuid.v4();
    var command = {
      id: newUuid,
      command: "addItemToOrder",
      payload: {
        itemType: "album",
        itemId: "XXalbumId",
        name: "XXalbumName",
        price: 0, //XXalbumPrice
        artistId: "XXartistId",
        isActiveOffer: true, // is active offer
        offerId: "XXofferId"

      }
    };
    socket.emit("command", command);
    /*$.ajax({
     type:"POST",
     url:"/cart/item",
     data: {itemType:"album",itemId: "#{locals.info.albums._id}"},
     success: function(data) {
     //alert(sent);
     $('#alert').show();
     }
     });*/

  });
  $('#buyNow').click(function () {
    //var formData = $('#investorInfoForm').serialize();
    //var id = $("#uid").val();
    $.ajax({
      type: "POST",
      url: "/buynow/item",
      data: {itemType: "album", itemId: "XXXalbumId"},
      success: function (data) {
        //alert(sent);
        $('#alert').show();
      }
    });

  });

}