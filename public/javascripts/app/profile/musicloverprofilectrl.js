function MusicLoverProfileCtrl($http, $scope) {

    //todo these are dropins now, refactor to angular-kendo
    var pointsOverTimeChartDS = new kendo.data.DataSource(
        {
            transport: {
                read: '/api/wager/points/byitem/bydate/byuser/511a8c6ece62e90000000003'
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
            //aggregate: {field:"amount",aggregate:"sum"},
            /*change: function(e) {
             //debugger;
             console.log("testing running");
             var totSalesByAlbumAggr = revChartDS.aggregates();
             var total = totSalesByAlbumAggr.amount.sum;
             $("#totalEarnings").text(parseFloat(total).toFixed(2));
             }*/
        }
    );
    var pointsOverTimeChart = $('#pointsOverTimeChart').kendoChart({
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
    });
    // income dist
    var currentGameShareDist = $("#currentGameShareDist").kendoChart({
        title: {
            text: "Wager Distribution"
        },
        dataSource: {
            transport: {
                read: {
                    url: '/api/wagers/byuser/' + $scope.curUser._id,
                    dataType: "json"
                }
            }
        },
        legend: {
            position: "bottom",
            visible: true
        },
        seriesDefaults: {
            type: "pie",
            labels: {
                visible: true,
                template: "#= category #"
            }
        },
        series: [
            {
                name: "Total Chips",
                field: "totalChips",
                type: "pie",
                categoryField: "name"
            }
        ],

        valueAxis: {
            labels: {
                format: "${0}"
            }
        },
        categoryAxis: {
            //baseUnit: "weeks",
            field: "name"
        },
        chartArea: {

            height: 300
        }
    });
    var leaderGridDS = new kendo.data.DataSource(
        {
            transport: {
                read: '/api/wager/leaders'
            },

            aggregate: [
                {field: "totalChips", aggregate: "sum"},
                {field: "totalPoints", aggregate: "sum"}

            ],
            change: function (e) {
                //debugger;
                //var aggr = leaderGridDS.aggregates();
                //var total = aggr.totalPoint.sum;
                //$("#totalChipsSum").val(total);
            }
            //data: [
            //    {rank:1,name:"Luke",points:457},
            //    {rank:2,name:"Kyle",points:222},
            //    {rank:3,name:"Stan",points:123}
            //]
        }

    );
    var leaderGrid = $("#leadergrid").kendoGrid({
        height: 200,
        columns: [

            {title: "Name", field: "_id.userAlias"},
            {title: "Score", field: "points"}
        ],
        dataSource: leaderGridDS
    });
    $("#gamegrid").kendoGrid({
        height: 200,
        columns: [
            {title: "Band", field: "band"},
            {title: "Album", field: "name"},
            {title: "# Of Chips Bet", field: "totalChips"},
            {title: "# of Points Gained", field: "totalPoints"},
            {title: "% return", field: "pctReturn"}
        ],
        dataSource: {
            data: [
                {band: "Moop", name: "Sunrise", numChipsBet: 25, numPointsGained: 5, pctReturn: 65},
                {band: "Geezer", name: "SkyFall", numChipsBet: 10, numPointsGained: 25, pctReturn: 356},
                {band: "Stadium", name: "Owl", numChipsBet: 34, numPointsGained: 44, pctReturn: 80},
                {band: "Avant", name: "Garde", numChipsBet: 10, numPointsGained: 22, pctReturn: 20}

            ]
        },
        dataSource: {
            //data:[
            //    {band:"Moop",album:"Trilogy",dolOnOffer:10000,dolPerShare:1000,numOfShares:10},
            //    {band:"Faith+1",album:"Renewal",dolOnOffer:5000,dolPerShare:100,numOfShares:50}
            //],
            transport: {
                read: '/api/wagers/byuser/' + $scope.curUser._id
            },
            pageSize: 10
        }

    });

}