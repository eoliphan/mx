var Order  = require("../repositories/order").Order,
    Artist = require("../repositories/artist").Artist,
    mongoose = require('mongoose'),
    logger = require("../logger"),
    _ = require('underscore'),
    uuid = require('node-uuid'),
    evtcmdbus = require('../evtcmdbus'),
    async = require("async");

module.exports = function(app){
    app.get('/api/artist/basicinfo', function(req,res){
            //logger.debug("works!!!!");
            if (!req.user || !req.user._id) {
                return res.send({});
            }
            // todo add limit of fields
            Artist.findOne({userId: req.user._id},function(err,artist){
                if(err) {
                    return res.send(400);
                }
                if (artist == null)
                    return res.send({});
                else
                    return res.send(artist);
            });
    });
    app.put('/api/artist/basicinfo',function(req,res){
        var newArtist = req.body;
        newArtist.userId = req.user._id;
        // need to sent event via cqrs
        logger.debug("new Artist Info"+JSON.stringify(newArtist));
        var cmd = {
            id: uuid.v4(),
            command:'createArtist',
            payload: newArtist

        }
        evtcmdbus.emitCommand(cmd);
        res.send(200);
    });





}

