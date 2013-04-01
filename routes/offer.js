var Order  = require("../repositories/order").Order,
    Artist = require("../repositories/artist").Artist,
    Offer = require("../repositories/offer").Offer,
    mongoose = require('mongoose'),
    logger = require("../logger"),
    _ = require('underscore'),
    uuid = require('node-uuid'),
    evtcmdbus = require('../evtcmdbus'),
    async = require("async");

module.exports = function(app){
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


