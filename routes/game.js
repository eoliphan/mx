var domain = require("../domain/domain").domain,
    logger = require("../logger")
    , evdcmdbus = require("../evtcmdbus")
;

exports.addChips = function(req,res) {

    logger.debug(JSON.stringify(req.body));
    var command = req.body;
    // add user id from session

    res.send(200);

    evdcmdbus.emitCommand(command);

    //domain.handle(command);

}