var Order  = require("../repositories/order").Order,
    Artist = require("../repositories/artist").Artist,
    Wager = require("../repositories/wager").Wager,
    mongoose = require('mongoose'),
    logger = require("../logger"),
    _ = require('underscore'),
    uuid = require('node-uuid'),
    evtcmdbus = require('../evtcmdbus'),
    async = require("async");

module.exports = function(app){
    app.get('/api/chips/user',function(req,res){
        var userId = mongoose.Types.ObjectId(req.user._id);
        Wager.aggregate(
            {$match:{userId:userId}},
            {$group:{
                _id:{userId:"$userId"},
                totalPoints:{$sum:"$points"}
            }},
            function(err,wagerpoints) {
                if (err) {
                    return logger.error("Error summing user points");
                } else {
                    res.send(wagerpoints);
                }
            }
        );
        // get the
    });
    app.get('/api/wager/leaders',function(req,res) {

        Wager.aggregate(
            {$group:{
                _id:{userId:"$userId",userAlias:"$userAlias"},
                points: {$sum:"$points"}
            }},
            {$sort:{points:-1}},

            function(err,wagers){
                if(err){
                    return logger.error("Error getting wagers: " + err);
                } else {
                    res.send(wagers);
                }

        });


    });
    app.get('/api/orders/asdfs', function(req,res){
            //logger.debug("works!!!!");
//            if (!req.user || !req.user._id) {
//                return res.send({});
//            }
            var artistId = mongoose.Types.ObjectId(req.params.id);


            Order.aggregate(
                {$match:{'items.artistId':artistId,orderDate:{$ne:null}}},
                {$unwind:"$items"},
                {$sort:{orderDate:1}},
                {$project:{
                    'itemPrice':'$items.price',
                    "name":'$items.name',
                    year:{$year:'$orderDate'},
                    month:{$month:'$orderDate'},
                    day:{$dayOfMonth:'$orderDate'},
                    'orderDate':1}},
                {$group:{
                    _id:{year:"$year",month:"$month",day:"$day",name:"$name"},
                    totalSales:{$sum:"$itemPrice"}
                }},
                //{$sort:{_id:1}},
                {$project:{
                    //'orderDate':"$_id.orderDate",
                    year:"$year",
                    month:"$month",
                    day:"$day",
                    'name':"$_id.name",
                    'totalSales':"$totalSales"
                }},
            function(err,orders){
                if(!orders) {
                    return res.send({});
                } else {
                    //todo remvoe this test
                    _.each(orders, function(element,index,list){
                        //element.newDate = new Date();
                        // make a string date
                        var dateStr = element._id.month + "/"+ element._id.day + "/" + element._id.year;
                        element.orderDate = dateStr;
                    });
                    return res.send(orders);
                }
            });

    });

    app.get('/api/wager/points/byitem/bydate/byuser/:id',function(req,res){
        var user = mongoose.Types.ObjectId(req.params.id);
        Wager.aggregate(
            {$match:{userId:user}},

            {$unwind:"$history"},
            //{$sort:"$history.eventDate"},
            {$project:{
                'points':'$history.points',
                "name":'$name',
                year:{$year:'$history.eventDate'},
                month:{$month:'$history.eventDate'},
                day:{$dayOfMonth:'$history.eventDate'},
                'eventDate':'$history.eventDate'}},
            //{$sort:"$eventDate"},
            {$group: {
                _id:{eventDate:"$eventDate", year:"$year",month:"$month",day:"$day",name:"$name"}, //todo date
                totalPoints:{$sum:"$points"}

            }},
            {$project:{
                _id:0,
                year:"$_id.year",
                month:"$_id.month",
                day:"$_id.day",
                name:"$_id.name",
                totalPoints:"$totalPoints"

            }},
            function(err,wagers){
                if (err) {
                    return logger.error("Error getting wager summary: " + err);
                }
                if(!wagers) {
                    return res.send({});
                } else {
                    _.each(wagers,function(wager,index,list){
                        wager.pointDate = wager.month + "/" + wager.day + "/" + wager.year;
                    });
                    return res.send(wagers);
                }
            }

        );
    });

    app.get('/api/wagers/byuser/:id',function(req,res){

        var user = mongoose.Types.ObjectId(req.params.id);
        Wager.aggregate(
            {$match:{userId:user}},
            {$group:{
                _id:{itemId:"$itemId",name:"$name"},
                totalPoints:{$sum:"$points"},
                totalChips:{$sum:"$chipCount"}
            }},
            {$project:{
                itemId:"$_id.itemId",
                name:"$_id.name",
                totalPoints:"$totalPoints",
                totalChips:"$totalChips"

            }},
            function(err,wagers){
                if(!wagers) {
                    return res.send({});
                } else {
                    return res.send(wagers);
                }

            }
        );

    });

}


