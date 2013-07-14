var User = require("../repositories/user").User
  , logger = require("winston")
  , uuid= require("node-uuid")

  ,mongoose = require('mongoose');


exports.userPasswordChanged = function (event) {
  var userId = mongoose.Types.ObjectId(event.payload.id);
  var newPass = event.payload.password;
  User.findById(userId, function (err, user) {
    if (err) {
      logger.error("Error finding password:" + err);
      return;
    }
    // now use the passport-local stuff to update
    user.setPassword(newPass, function (err) {
      if (err) {
        logger.error("Error updating password:" + err);
        return;
      }
      user.save();
      logger.info("Password changed for: " + user);
    });
    logger.debug(user);

  });

}

exports.userWagerAdded = function (event) {

}

exports.userCreated = function (event) {

  var userinfo = event.payload;

  var confirmationCode = uuid.v4();
  User.register(new User({
    email: userinfo.email,
    isArtistPending: userinfo.artist,
    isInvestorPending: userinfo.investor,
    confirmationCode: confirmationCode }),
    userinfo.password, function (err, account) {
      if (err) {
        logger.error("Error creating account: " + err);
        //return res.send(400, {message: "Error creating account"});
      }

    });

}

exports.userDestroyed = function (event) {

}