function InvestorProfileCtrl($http, $scope) {



    /* //div(kendo-sparkline,kendo-source='summaryModel',
     data-series='[{type:"pie",field: "totalSales",categoryField:"offeringName"}]',
     data-chart-area='{height:300,width-300}')*/
    //todo: for now just moving chart code into controllers, next refactor to use angular-kendo to extent possible
    var revChartSparkDS = new kendo.data.DataSource(
        {
            transport: {
                read: '/api/offers/revenues/byoffer/byuser/investor/' + $scope.curUser._id
            }
        }
    );
    $('#summarySpark').kendoSparkline({
        dataSource: revChartSparkDS,
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
            width: 100,
            background: "#eeeeee"
        },
        tooltip: {
            visible: true,
            //template: "|#= value #|"
            format: "{0:c}"
        }

    });
    var revChartDS = new kendo.data.DataSource(
        {
            transport: {
                read: '/api/offers/revenues/byuser/' + $scope.curUser._id
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
                $("#totalEarnings").text(parseFloat(total).toFixed(2));
            }
        }
    );
    var revChart = $('#revenueChart').kendoChart({
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
            baseUnit: "months",
            field: "earnDate"
        },
        chartArea: {
            height: 300
            //,width:1200
            , margin: {right: 0, left: 0}
        }
    });


    var tabStrip = $('#revTab').kendoTabStrip().data("kendoTabStrip");

    function fillInTabs() {
        var offerTmpl = kendo.template($('#offeringTpl').html());
        $.ajax({
            url: '/api/offers/summary/byuser/' + $scope.curUser._id,
            method: 'GET',
            success: function (data) {
                _.each(data, function (element, index, list) {
                    //debugger;
                    console.log(element);
                    tabStrip.append({
                        text: element.name,
                        encoded: false,
                        content: offerTmpl(element)
                    });
                });
                // select the first one
                tabStrip.select(tabStrip.tabGroup.children("li").eq(0));
            }
        });
    }

    fillInTabs();
    function fragmentLoaded() {
        console.log("Fragment Loaded");
        fillInTabs();
    }

    $scope.summaryModel = new kendo.data.DataSource(
        {
            transport: {
                read: '/api/offers/revenues/byoffer/byuser/investor/511a8c6ece62e90000000003'
            }
        }
    )


}