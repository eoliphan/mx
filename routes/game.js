var domain = require("../domain/domain").domain,
    logger = require("../logger")
    , evdcmdbus = require("../evtcmdbus")
    , Wager = require("../repositories/wager").Wager
;

exports.addChips = function(req,res) {

    logger.debug(JSON.stringify(req.body));
    var command = req.body;
    // add user id from session

    res.send(200);

    evdcmdbus.emitCommand(command);

    //domain.handle(command);

};

exports.getWagerLeaders = function(req,res) {

    Wager.aggregate(
        {$group:{
            _id:"$userId",
            points: {$sum:"$points"}
        }},function(err,wagers){
            if(err){
                return logger.error("Error getting wagers: " + err);
            } else {
                res.send(wagers);
            }

    });


};