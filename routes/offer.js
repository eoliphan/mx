var Order  = require("../repositories/order").Order,
    Artist = require("../repositories/artist").Artist,
    Offer = require("../repositories/offer").Offer,
    Revenue = require("../repositories/offer").Revenue,
    mongoose = require('mongoose'),
    logger = require("../logger"),
    _ = require('underscore'),
    uuid = require('node-uuid'),
    evtcmdbus = require('../evtcmdbus'),
    async = require("async"),
    ObjectId = mongoose.Types.ObjectId
    ;

module.exports = function(app){
    app.get('/api/offers/revenues/byuser/:id',function(req,res){
        var userId = ObjectId(req.params.id);
        Revenue.find({investorId:userId},function(err,revenues){
            if (err){
                return res.send(400);
            }
            if (!revenues) {
                res.send({});
            }
            res.send(revenues);
        });

    });
    app.get('/api/offers/revenues/byoffer/byuser/:id',function(req,res){
            var userId = ObjectId(req.params.id);
            Revenue.aggregate(
                {$match:{investorId:userId}},
                //{$sort:{earnDate:1}},
                {$group:{
                    _id:{offeringName:"$offeringName"},
                    totalSales:{$sum:"$amount"}
                }},
                {$project:{
                    _id:0,
                    offeringName:"$_id.offeringName",
                    totalSales:"$totalSales"
                }},
                function(err,revenues){
                    if (err){
                        return res.send(400);
                    }
                    if (!revenues) {
                        res.send({});
                    }
                    res.send(revenues);
                }
            );
//            Revenue.find({investorId:userId},function(err,revenues){
//                if (err){
//                    return res.send(400);
//                }
//                if (!revenues) {
//                    res.send({});
//                }
//                res.send(revenues);
//            });

        });
    app.get('/api/offers/info/:id',function(req,res){

        var offerId = ObjectId(req.params.id);
        Offer.findOne({_id: offerId},function(err,offer){
            if(err) {
                res.send(400);
                return logger.error("error getting offer: "+err);
            }
            if (!offer) {
                res.send({});
            }
            // get the number of shares available
            var sharesPurchased = _.reduce(offer.investments,function(memo,investment) {
               return memo + investment.sharesPurchased;
            },0);
            var retOffer = offer.toObject();
            retOffer.sharesAvailable =  offer.numShares - sharesPurchased ;
            res.send(retOffer);

        });

    });
    app.post('/api/offers/investments/:id',function(req,res){
        // take a new investment
        var newInvestment = req.body;
        newInvestment.userId = req.user._id;
        newInvestment.purchaseDate  = new Date();
        newInvestment.offerId = req.params.id;
        newInvestment.sessionId = req.session.id;

        // need to sent event via cqrs
        logger.debug("new Investment  Info"+JSON.stringify(newInvestment));
        var cmd = {
            id: uuid.v4(),
            command:'addInvestmentToOffer',
            payload: newInvestment

        }
        evtcmdbus.emitCommand(cmd);
        res.send(200);


    });
    app.get('/api/offers', function(req,res){
            //logger.debug("works!!!!");
            if (!req.user || !req.user._id) {
                return res.send({});
            }
            // todo add limit of fields
            Offer.find({userId: req.user._id},function(err,offers){
                if(err) {
                    return res.send(400);
                }
                if (offers == null)
                    return res.send({});
                else
                    return res.send(offers);
            });
    });
    app.post('/api/offers',function(req,res){
        var newOffer = req.body;
        newOffer.userId = req.user._id;
        newOffer.sessionId = req.session.id;
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


