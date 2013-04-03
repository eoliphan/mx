var Order  = require("../repositories/order").Order,
    Artist = require("../repositories/artist").Artist,
    Offer = require("../repositories/offer").Offer,
    mongoose = require('mongoose'),
    logger = require("../logger"),
    _ = require('underscore'),
    uuid = require('node-uuid'),
    evtcmdbus = require('../evtcmdbus'),
    moment = require('moment'),
    async = require("async");

module.exports = function(app){
    app.get('/api/orders/total/bydate/byartist/:id', function(req,res){
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
    app.get('/api/orders/total/byartist/:id', function(req,res){
                //logger.debug("works!!!!");
    //            if (!req.user || !req.user._id) {
    //                return res.send({});
    //            }
                var artistId = mongoose.Types.ObjectId(req.params.id);


                Order.aggregate(
                    {$match:{'items.artistId':artistId,orderDate:{$ne:null}}},
                    {$unwind:"$items"},
                    //{$sort:{orderDate:1}},
                    {$project:{
                        'itemPrice':'$items.price',
                        "name":'$items.name'
                        }},
                    {$group:{
                        _id:{name:"$name"},
                        totalSales:{$sum:"$itemPrice"}
                    }},
                    //{$sort:{_id:1}},
                    {$project:{
                        'name':"$_id.name",
                        'totalSales':"$totalSales"
                    }},
                function(err,orders){
                    if(!orders) {
                        return res.send({});
                    } else {
                        //todo remvoe this test
//
                        return res.send(orders);
                    }
                });

        });
    app.get('/api/orders/topsales/byartist/thisweek', function(req,res){
            //logger.debug("works!!!!");
//            if (!req.user || !req.user._id) {
//                return res.send({});
//            }
            var artistId = mongoose.Types.ObjectId(req.params.id);
            var startDate = new moment().subtract('days',7).toDate(); //todo, grab week refactor since only date range is relevant

            Order.aggregate(
                {$match:{orderDate:{$gte:startDate}}},
                {$unwind:"$items"},
                {$sort:{orderDate:-1}},
                {$project:{
                    'itemPrice':'$items.price',

                    "artistId":"$items.artistId",
                    "artistName":"$items.artistName"
                    }},
                {$group:{
                    _id:{artistId:"$artistId",artistName:"$artistName"},
                    totalSales:{$sum:"$itemPrice"}
                }},
                {$sort:{totalSales:-1}},
                {$limit:10},
            function(err,orders){
                if(!orders) {
                    return res.send({});
                } else {
                    //todo remvoe this test
//
                    return res.send(orders);
                }
            });

    });
    app.get('/api/orders/topsales/byartist/thismonth', function(req,res){
                //logger.debug("works!!!!");
    //            if (!req.user || !req.user._id) {
    //                return res.send({});
    //            }
                var artistId = mongoose.Types.ObjectId(req.params.id);
                var startDate = new moment().subtract('days',30).toDate(); //todo, grab week refactor since only date range is relevant

                Order.aggregate(
                    {$match:{orderDate:{$gte:startDate}}},
                    {$unwind:"$items"},
                    {$sort:{orderDate:-1}},
                    {$project:{
                        'itemPrice':'$items.price',

                        "artistId":"$items.artistId",
                        "artistName":"$items.artistName"
                        }},
                    {$group:{
                        _id:{artistId:"$artistId",artistName:"$artistName"},
                        totalSales:{$sum:"$itemPrice"}
                    }},
                    {$sort:{totalSales:-1}},
                    {$limit:10},
                function(err,orders){
                    if(!orders) {
                        return res.send({});
                    } else {
                        //todo remvoe this test
    //
                        return res.send(orders);
                    }
                });

        });
    app.get('/api/orders/topsales/byartist/thisyear', function(req,res){
                    //logger.debug("works!!!!");
        //            if (!req.user || !req.user._id) {
        //                return res.send({});
        //            }
                    var artistId = mongoose.Types.ObjectId(req.params.id);
                    var startDate = new moment().subtract('year',1).toDate(); //todo, grab week refactor since only date range is relevant

                    Order.aggregate(
                        {$match:{orderDate:{$gte:startDate}}},
                        {$unwind:"$items"},
                        {$sort:{orderDate:-1}},
                        {$project:{
                            'itemPrice':'$items.price',

                            "artistId":"$items.artistId",
                            "artistName":"$items.artistName"
                            }},
                        {$group:{
                            _id:{artistId:"$artistId",artistName:"$artistName"},
                            totalSales:{$sum:"$itemPrice"}
                        }},
                        {$sort:{totalSales:-1}},
                        {$limit:10},
                    function(err,orders){
                        if(!orders) {
                            return res.send({});
                        } else {
                            //todo remvoe this test
        //
                            return res.send(orders);
                        }
                    });

            });
    app.get('/api/orders/total/bydate/byalbum/:id', function(req,res){
                //logger.debug("works!!!!");
//                if (!req.user || !req.user._id) {
//                    return res.send({});
//                }
                //var itemId = req.params.id;
                var itemId = mongoose.Types.ObjectId(req.params.id);

                Order.aggregate(
                    {$match:{'items.itemId':itemId,orderDate:{$ne:null}}},
                    {$unwind:"$items"},
                    {$project:{
                        'itemPrice':'$items.price',
                        'orderDate':1}},

                    {$group:{
                        _id:"$orderDate",
                        totalSales:{$sum:"$itemPrice"}
                    }},
                    {$sort:{_id:1}},
                function(err,orders){
                    if(!orders) {
                        return res.send({});
                    } else {
                        //todo remvoe this test
                        /*_.each(orders, function(element,index,list){
                            element.newDate = new Date();
                        });*/
                        return res.send(orders);
                    }
                });
                // todo add limit of fields

        });
    app.post('/api/orders',function(req,res){
        var newOffer = req.body;
        newOffer.userId = req.user._id;
        // need to sent event via cqrs
        logger.debug("new Offer Info"+JSON.stringify(newOffer));
        var cmd = {
            id: uuid.v4(),
            command:'createOffer',
            payload: newOffer

        }
        evtcmdbus.emitCommand(cmd);
        res.send(200);
    });

}


