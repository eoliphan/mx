function MainCtrl($http, $scope, $route, $routeParams, $location, principal, authority, authService) {
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
function StoreCtrl($scope) {
    $scope.carInterval = 5000;
    $scope.slides = [
        {image: 'images/store/store1.jpg', title: 'Moop', text: 'Their Debut Release'},
        {image: 'images/store/store2.jpg', title: 'Vanguard', text: 'Their Sophmore Album'},
        {image: 'images/store/store1.jpg', title: 'Orion 2', text: 'Topping the Charts'}
    ];


}
function CartCtrl() {

}
function AboutCtrl() {

}
function FaqCtrl() {

}

function ProfileCtrl() {

}


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
function BuyChipsDlgCtrl($scope, dialog) {

    //todo add read of current chip data
    $scope.close = function (chipWager) {
        dialog.close(chipWager);
    };
}
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
function AlbumCtrl($http, $scope, $stateParams, $state, $dialog,socket) {


    var albumId = $stateParams.albumId;

    $http
        .get('/api/album/' + albumId)
        .success(function (data) {
            $scope.albumInfo = data;
            // format price and releasedate


        })
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
            command = {
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
        command = {
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

