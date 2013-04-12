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
//        var newOffer = req.body;
//        newOffer.userId = req.user._id;
        // need to sent event via cqrs
//        logger.debug("new Offer Info"+JSON.stringify(newOffer));
//        var cmd = {
//            id: uuid.v4(),
//            command:'createOffer',
//            payload: newOffer
//
//        }
//        evtcmdbus.emitCommand(cmd);
//        res.send(200);
    });

}


