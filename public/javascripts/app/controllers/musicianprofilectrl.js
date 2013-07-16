/* jshint browser:true, developer: true */


function MusicianProfileCtrl($http, $scope) {
  "use strict";

  console.log("running musician profile controller");

   var setupCharts = function () {
      //todo, refactor out jquery, use angular-kendo, etc
      function offerWizardToMain() {
        $('#profileMain').show();
        //$('#newOfferingWizard').hide();
        $('#wizardWell').hide();
        //$('#newOfferingWizard').wizard();

      }

      $('#submitCreateOffering').click(function () {
        var formData = $('#newOfferingForm').serialize();
        //var id = $("#uid").val();
        $.ajax({
          type: "POST",
          url: "/api/offers",
          data: formData,
          success: function (data) {
            //alert(sent);
            //$('#alert').show();
            offerWizardToMain();
          }
        });

      });
      $('#newOfferingWizard').on('change', function (e, data) {
        //debugger;
        if (data.direction === 'next' && data.step === 2) {
          var summaryText =
            "Offering Name: " + $('#newOfferingForm #offeringName').val() + "<br/>" +
              "Offering Description: " + $('#newOfferingForm #offerDescription').val() + "<br/>" +
              "Price: " + $('#newOfferingForm #price').val() + "<br/>" +
              "Raise Amount: $" + $('#newOfferingForm #raiseAmount').val() + "<br/>" +
              "Pecentage to sell: " + $('#newOfferingForm #pctOfferingToSell').val() + "%<br/>" +
              "Number of Shares: " + $('#newOfferingForm #numShares').val() + "<br/>";
          $('#offerSummary').html(summaryText);
          // alert('last page, compute');
        }

      });
      function updatePricePerShare() {

        var curRaiseAmount = $("#newOfferingForm #raiseAmount").val();
        var curNumShares = $("#newOfferingForm #numShares").val();

        if (!curRaiseAmount || !curNumShares || curRaiseAmount == 0 || curNumShares == 0) {
          $('#pricePerShareLabel').text('Price Per Share: ');
        } else {

          var pps = parseFloat(curRaiseAmount) / parseInt(curNumShares);
          pps = parseFloat(pps).toFixed(2);
          $('#pricePerShareLabel').text('Price Per Share: ' + pps);
        }
      }

      $('#raiseAmount').keypress(function () {
        updatePricePerShare();
      });
      $('#numShares').keypress(function () {
        updatePricePerShare();
      });

      var totalRevAllAlbumChartDS = new kendo.data.DataSource(
        {
          transport: {read: '/api/offers/revenues/byuser/offeror/' + $scope.curUser._id},
          schema: {
            model: {
              fields: {
                earnDate: {
                  type: "date"
                }
              }
            }
          },
          group: {field: "offeringName"},
          sort: {field: "earnDate", dir: "asc"}
        }
      );
      var totalRevAllAlbumChart = $('#totalRevAllAlbumChart').kendoChart({
        //autoBind:false,
        title: {text: "Total Revenue By Album"},
        dataSource: totalRevAllAlbumChartDS,
        series: [
          {type: "line", field: "amount", missingValues: "interpolate"}

        ],
        chartArea: { height: 200},
        tooltip: {visible: true},
        categoryAxis: {baseUnit: "months", field: "earnDate"}

      });
      var revChartSparkDS = new kendo.data.DataSource(
        {
          transport: {
            read: '/api/offers/revenues/byoffer/byuser/offeror/' + $scope.curUser._id
          },
          aggregate: {field: "totalSales", aggregate: "sum"}
        }
      );
      var revDistChart = $('#revenueDistributionChart').kendoChart({
        //autoBind: false,
        dataSource: revChartSparkDS,
        title: {text: "Revenue Distribution"},
        series: [
          {type: "pie", field: "totalSales", categoryField: "offeringName" }
        ],
        chartArea: {height: 200},
        tooltip: {visible: true, template: "#= dataItem.offeringName # - #=  numeral(dataItem.totalSales).format('$0,0.00') #"},
        legend: {visible: false}

      });
      $("#topSalesWeek").kendoGrid({
        dataSource: {
          transport: {read: "/api/orders/topsales/byartist/thisweek"}
        },
        columns: [
          {field: "_id.artistName", title: "Artist"},
          {field: "totalSales", title: "Sales", format: "{0:c}"}
        ],
        chartArea: { height: 200}
      });
      $("#topSalesMonth").kendoGrid({
        dataSource: {
          transport: {
            read: "/api/orders/topsales/byartist/thismonth"
          }
        },
        columns: [
          {field: "_id.artistName", title: "Artist"},
          {field: "totalSales", title: "Sales", format: "{0:c}"}

        ],
        chartArea: {
          height: 200
        }
      });
      $("#topSalesYear").kendoGrid({
        dataSource: {
          transport: {
            read: "/api/orders/topsales/byartist/thisyear"
          }
        },
        columns: [
          {field: "_id.artistName", title: "Artist"},
          {field: "totalSales", title: "Sales", format: "{0:c}"}

        ],
        chartArea: {
          height: 200
        }
      });
      var curAlbumId;
      var totSalesByAlbumDS = new kendo.data.DataSource({
        transport: {
          read: {
            //url: "/api/orders/total/bydate/byalbum/514a71b879077db37200000a",
            url: function (params) {
              //debugger;
              if (!curAlbumId)
                return "/api/orders/total/bydate/byalbum/514a71b879077db37200000a";
              else
                return "/api/orders/total/bydate/byalbum/" + curAlbumId;
            },
            dataType: "json"
          }
        },
        sort: {
          field: "_id",
          dir: "asc"
        },
        schema: {
          model: {
            fields: {
              _id: {
                type: "date"
              }
            }
          }
        },
        aggregate: {field: "totalSales", aggregate: "sum"},
        change: function (e) {
          //debugger;
          console.log("testing running");
          var totSalesByAlbumAggr = totSalesByAlbumDS.aggregates();
          if (totSalesByAlbumAggr && totSalesByAlbumAggr.totalSales) {
            var total = totSalesByAlbumAggr.totalSales.sum;
            $("#albumTotal").text(parseFloat(total).toFixed(2));
          }
        }

      });
      //totSalesByAlbumDS.read();
      var totSalesByAlbum = $("#totalSalesByAlbumChart").kendoChart({
        autoBind: false,
        title: {
          text: "Offering Sales"
        },
        dataSource: totSalesByAlbumDS,
        legend: {
          position: "bottom"
        },
        seriesDefaults: {
          type: "area"
        },
        series: [
          {
            name: "Total Sales",
            field: "totalSales",
            missingValues: "interpolate"
          }
        ],
        valueAxis: {
          labels: {
            format: "${0}"
          }
        },
        categoryAxis: {
          baseUnit: "years",
          field: "_id"
        },
        chartArea: {
          //width:300,
          height: 200
        }
      });

      //totSalesByAlbumDS.
      //debugger;
      //var totSalesByAlbumAggr = totSalesByAlbumDS.aggregates();
      //var total = totSalesByAlbumAggr.totalSales.sum;
      //$("#albumTotal").val(parseFloat(total).toFixed(2));
      var totSalesAllAlbum = $("#totalSalesAllAlbumChart").kendoChart({
        title: {
          text: "Total Sales By Album"
        },
        dataSource: {
          transport: {
            read: {
              url: "/api/orders/total/bydate/byartist/5145ec8237f23b0000000006",
              dataType: "json"
            }
          },
          sort: {
            field: "orderDate",
            dir: "asc"
          },
          group: {
            field: "name",
            dir: "asc"
          },
          schema: {
            model: {
              fields: {
                orderDate: {
                  type: "date"
                }
              }
            }
          }
        },
        legend: {
          position: "bottom",
          visible: false
        },

        series: [
          {
            name: "Total Sales",
            field: "totalSales",
            type: "line",
            missingValues: "interpolate"
          }
        ],

        valueAxis: {
          labels: {
            format: "${0}"
          }
        },
        categoryAxis: {
          baseUnit: "months",
          field: "orderDate"
        },
        chartArea: {
          //width:300,
          height: 200
        },
        schema: {
          model: {
            fields: {
              orderDate: {
                type: "date"
              }
            }
          }
        },
        tooltip: {
          visible: true,
          template: "#= series.name # - #=  numeral(value).format('$0,0.00')   #"
          //format: "{0:c}"
        }
      });
      // income dist
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
      var incomeDistChart = $("#incomeDistributionChart").kendoChart({
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
          //width:300,
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

      });
      var recentOffersDS = new kendo.data.DataSource({
        transport: {
          read: '/api/offers'
        },
        pageSize: 5

      });
      $("#recentOffersGrid").kendoGrid({
        //autoBind: false,
        height: 150,
        columns: [
          {title: "Name", field: "name"},
          {title: "Raise Amount", field: "amtToRaise"},
          {title: "# Shares", field: "numShares"}
        ],
        dataSource: recentOffersDS,
        selectable: "row",
        change: function () {
          var sel = this.select();
          var data = this.dataItem(sel[0]);
          console.log('selected: ' + JSON.stringify(data));
          //set values
          //todo: refactor
          // kendo mvvm
          var offerDataModel = new kendo.observable(data);
          kendo.bind($('#offerDetails'), offerDataModel);
          /*$("#offerDetails #amtToRaise").val(data.amtToRaise);
           $("#offerDetails #pctOfferingToSell").val(data.pctOfferingToSell);
           $("#offerDetails #costPerShare").val(data.amtToRaise / data.numShares);*/
          //debugger;
          //totSalesByAlbumDS.transport.read.url = "/api/orders/total/bydate/byalbum/"+data.itemId;
          curAlbumId = data.itemId;
          totSalesByAlbumDS.read();
          totSalesByAlbum.data("kendoChart").refresh();


        }
      });

      $('#offeringWizardModal').on('shown', function () {
        //alert("modal shown");
        $('#newOfferingWizard').wizard();
      });
      function hideOfferDetails() {
        console.log('hiding');
        $('#pendOffer').hide();
        $('#actOffer').hide();
        $('#compOffer').hide();
        $('#offerDetail').hide();

      }

      function getBandInfo() {
        $.ajax({
          type: "GET",
          url: "/api/artist/basicinfo",
          success: function (data) {
            if (_.isEqual(data, {})) {
              hideOfferDetails();
              $('#submitUpdateArtist').hide();
              $('#submitAddOffering').hide();

            } else {
              $('#artistName').val(data.artistName);
              $('#phone').val(data.phone);
              $('#bio').val(data.bio);
              $('#submitUpdateArtist').show();
              $('#submitAddOffering').show();
              $('#submitCreateArtist').hide();
            }
          }

        });

      };
      /*$(document).ready(function(){
       alert('fragment loaded');
       getBandInfo();


       });
       $('#profileMain').load(function(){
       alert('fragment loaded (load)');
       });
       $('#profileMain').livequery('load',function(event){
       alert('fragment loaded (load lq)');
       });*/
      $('#submitCreateArtist').click(function () {
        var formData = $('#artistInfoForm').serialize();
        //var id = $("#uid").val();
        $.ajax({
          type: "PUT",
          url: "/api/artist/basicinfo",
          data: formData,
          success: function (data) {
            //alert(sent);
            $('#alert').show();
          }
        });

      });
      $('#submitAddOffering').click(function () {
        $('#profileMain').hide();
        $('#newOfferingWizard').show();
        $('#wizardWell').show();
        $('#newOfferingWizard').wizard();

      });
      $('#submitBasic').click(function () {
        var formData = $('#basicInfoForm').serialize();
        var id = $("#uid").val();
        $.ajax({
          type: "PUT",
          url: "/api/user/" + id,
          data: formData,
          success: function (data) {
            //alert(sent);
            $('#alert').show();
          }
        });

      });
      $('#submitInvestor').click(function () {
        var formData = $('#investorInfoForm').serialize();
        var id = $("#uid").val();
        $.ajax({
          type: "PUT",
          url: "/api/user/" + id,
          data: formData,
          success: function (data) {
            //alert(sent);
            $('#alert').show();
          }
        });

      });
    };
  //region Description
  $scope.$on('$viewContentLoaded', setupCharts);
  //endregion

  // standin for document.ready()
  function fragmentLoaded() {
    // have to do this to make sure the graphs are sized appropriately
    totSalesByAlbum.data('kendoChart').refresh();
    //totSalesAllAlbum.data('kendoChart').refresh();
    revDistChart.data('kendoChart').refresh();
    //incomeDistChart.data('kendoChart').refresh();

  }

  //--todo figrue out page load
  //getBandInfo();


}