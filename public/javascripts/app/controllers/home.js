/* jslint browser: true, devel:true */
/* global uuid */

function HomeCtrl($scope, $http, $location,socket,lookups) {
  "use strict";
  //todo:----- refactor
  $scope.addAlbum = function () {
    var payload = {
      id: $scope.curArtist._id,
      albumId: (new ObjectId()).toString(),
      name: "New Album...",
      description: "Add A Description...",
      price: 0

    };
    var cmd = {
      id: uuid.v4(),
      command: "addAlbum",
      payload: payload

    };
    socket.emit("command", cmd);

  };
  socket.on('albumAdded', function (data) {
    console.log("album added: " + JSON.stringify(data));
    //todo: need positive ack
    setTimeout(function () {
      $location.path('/album/edit/' + data.albumId);
    }, 1000);

  });
  //endtodo: -----


  $scope.offers = [];
  $scope.gridOptions = {
    data: 'offers',
    columnDefs: [
      {field: "name", displayName: "Album/Song"},
      {field: "amtToRaise", displayName: "Raise Amount"},
      {field: "numShares", displayName: "# Shares"},
      {field: "pctOfferingToSell", displayName: "% For Sale"},
      {cellTemplate: "<div><a ng-click='editAlbum(row)' class='btn btn-small btn-primary' style='margin-left: float; margin-right: float'>More Info</a></div>"}
    ]
  };
  $http.get('/api/offers')
    .success(function (data) {
      console.log(data);
      $scope.offers = data;
      //$scope.gridOptions.data = $scope.albums;

      if (!$scope.$$phase) {
        $scope.$apply();
      }

    });
  // private home
  if ($scope.curUser && $scope.curUser.isArtist) {
    $scope.refreshCurArtist();
  }
  $scope.addInvestorInfo = function () {
    $http.post('/api/investor', $scope.curUser)
      .success(function (data) {

      })
      .error(function (data) {

      });
  };
  $scope.addArtistInfo = function () {
    var payload = {};
    payload.curUser = $scope.curUser;
    payload.curArtist = $scope.curArtist;
    $http.post('/api/artist', payload)
      .success(function (data) {

      })
      .error(function (data) {

      });
  };
  socket.on('artistCreated', function (data) {
    _.delay($scope.refreshCurUserAndArtist, 500);
  });
  $scope.revenueByOfferOptions = {
    dataSource: {
      transport: {
        //read: '/api/offers/revenues/byoffer/byuser/investor/' + $scope.curUser._id
      }
    },
    series: [
      {
        type: "pie",
        field: "totalSales",
        categoryField: "offeringName",
        tootip: {
          //visible:true,
          //format: "{c}",
          //template: "|#= value #|"
        }
      }

    ],
    chartArea: {
      height: 100,
      width: 100
      //background: "#eeeeee"
    },
    tooltip: {
      visible: true,
      //template: "|#= value #|"
      format: "{0:c}"
    }
  };
  var revChartDS = new kendo.data.DataSource(
    {
      transport: {
        //read: '/api/offers/revenues/byuser/' + $scope.curUser._id
      },
      schema: {
        model: {
          fields: {
            earnDate: {
              type: "date"
            }
          }
        }
      },
      group: {
        field: "offeringName"
      },
      sort: {
        field: "earnDate",
        dir: "asc"
      },
      aggregate: {field: "amount", aggregate: "sum"},
      change: function (e) {
        //debugger;
        console.log("testing running");
        var totSalesByAlbumAggr = revChartDS.aggregates();
        var total = totSalesByAlbumAggr.amount.sum;
        //$("#totalEarnings").text(parseFloat(total).toFixed(2));
        $scope.investorTotalEarnings = total;
      }
    }
  );
  $scope.revenueHistoryOptions = {
    title: "Revenue History",
    dataSource: revChartDS,
    series: [
      {
        name: "Earnings",
        field: "amount",
        type: "line",
        missingValues: "interpolate"
      }
    ],
    categoryAxis: {
      baseUnit: "years",
      field: "earnDate"
    },
    chartArea: {
      height: 300
      //,width:1200
      , margin: {right: 0, left: 0}
    }
  };

  var revChartSparkDS = new kendo.data.DataSource(
    {
      transport: {
        //read: '/api/offers/revenues/byoffer/byuser/offeror/' + $scope.curUser._id
      },
      aggregate: {field: "totalSales", aggregate: "sum"}
    }
  );
  $scope.revenueDistributionOptions = {
    //autoBind: false,
    dataSource: revChartSparkDS,
    title: {text: "Revenue Distribution"},
    series: [
      {type: "pie", field: "totalSales", categoryField: "offeringName" }
    ],
    chartArea: {height: 200, width: 200},
    tooltip: {visible: true, template: "#= dataItem.offeringName # - #=  numeral(dataItem.totalSales).format('$0,0.00') #"},
    legend: {visible: false}

  };

  var incomeDistChartDS = new kendo.data.DataSource({
    transport: {
      read: {
        url: "/api/orders/total/byartist/5145ec8237f23b0000000006",
        dataType: "json"
      }
    },


    aggregate: {field: "totalSales", aggregate: "sum"},
    change: function (e) {
      //debugger;
      console.log("testing running");
      var totSalesByAlbumAggr = incomeDistChartDS.aggregates();
      //debugger;
      if (totSalesByAlbumAggr.totalSales) {
        var total = totSalesByAlbumAggr.totalSales.sum;
        $("#globalTotal").text("$ " + parseFloat(total).toFixed(2));
      }
    }
  });
  $scope.incomeDistributionOptions = {
    //autoBind: false,
    title: {
      text: "Income Distribution"
    },
    dataSource: incomeDistChartDS,
    legend: {
      position: "bottom",
      visible: false
    },
    seriesDefaults: {
      type: "pie",
      labels: {
        visible: true
      }
    },
    series: [
      {
        name: "Total Sales",
        field: "totalSales",
        type: "pie",
        categoryField: "name",
        labels: {
          format: "{0:c}",
          visible: false
        }

      }
    ],
    valueAxis: {
      //labels: {
      //    format: "{0:c}"
      //}
    },
    chartArea: {
      width: 200,
      height: 200
    },
    categoryAxis: {
      //baseUnit: "weeks",
      field: "name"
    },
    tooltip: {
      visible: true,
      template: "#= dataItem.name # - #=  numeral(dataItem.totalSales).format('$0,0.00') #"
      //format: "{0:c}"
    }

  };
  function refreshUserHome() {
    console.log("Refreshing uuser home");
    if ($scope.curUser.isInvestor) {
      $http.get('/api/offers/revenues/byoffer/byuser/investor/' + $scope.curUser._id)
        .success(function (data) {
          console.log("investor data" + data);
          $scope.revenuesByOfferData = data;


        }
      )
      ;

    }

  }

  // music lover
  var pointsOverTimeChartDS = new kendo.data.DataSource(
    {
      transport: {
        //read: '/api/wager/points/byitem/bydate/byuser/' + $scope.curUser._id
      },
      schema: {
        model: {
          fields: {
            pointDate: {
              type: "date"
            }
          }
        }
      },
      group: {
        field: "name"
      },
      sort: {
        field: "pointDate",
        dir: "asc"
      }

    }
  );
  $scope.gamePointsOverTimeOptions = {
    title: "Game Points Over Time",
    dataSource: pointsOverTimeChartDS,
    series: [
      {
        name: "Points",
        field: "totalPoints",
        type: "line",
        missingValues: "interpolate"
      }
    ],
    categoryAxis: {
      baseUnit: "months",
      field: "earnDate"
    },
    chartArea: {
      height: 300
      //,width:1200
      , margin: {right: 0, left: 0}
    }
  };

  $scope.$on("LoggedIn", function () {
    refreshUserHome();

  });
//todo: this seems messy
  if ($scope.user.isAuthenticated()) {
    refreshUserHome();

  }

}