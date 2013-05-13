var User = require("../repositories/user").User
, logger = require("../logger"),
    mongoose = require('mongoose');


exports.userPasswordChanged = function(event){
    var userId = mongoose.Types.ObjectId(event.payload.id);
    var newPass = event.payload.password;
    User.findById(userId,function(err,user){
        if(err){
            logger.error("Error finding password:" +err);
            return;
        }
        // now use the passport-local stuff to update
        user.setPassword(newPass,function(err){
            if(err) {
                logger.error("Error updating password:" + err);
            }
        });
        logger.debug(user);

    });

}

exports.userWagerAdded = function(event){

}

exports.userCreated = function(event) {

}

exports.userDestroyed =function(event) {

}