var User = require("../repositories/user").User
, logger = require("../logger"),
    mongoose = require('mongoose');


exports.userPasswordChanged = function(event){
    var userId = mongoose.Types.ObjectId(event.payload.id);
    var newPass = event.payload.password;
    User.findByIdAndUpdate(userId,{'password':newPass},function(err,data){
        if(err){
            logger.error("Error updating password:" +err);
            return;
        }
        logger.debug(data);

    });

}

exports.userWagerAdded = function(event){

}

exports.userCreated = function(event) {

}

exports.userDestroyed =function(event) {

}