/* jshint node:true */
"use strict";

var User = require("../repositories/user").User,
   logger = require("winston"),
   uuid= require("node-uuid"),
  _ = require('underscore'),

  mongoose = require('mongoose');


exports.investorInfoAdded = function(event) {
  var userId = mongoose.Types.ObjectId(event.payload.id);
  var investorInfo = _.omit(event.payload,['id']);
  User.update({_id:userId},{$set:investorInfo},function(err,user){
    logger.debug("user: " + user.toObject + " updated for event: " + event);
  });

};

exports.userUpdated = function(event) {
  var userId = mongoose.Types.ObjectId(event.payload.id);
  var investorInfo = _.omit(event.payload,['id']);
  User.update({_id:userId},{$set:investorInfo},function(err,user){
    logger.debug("user: " + user.toObject + " updated for event: " + event);
  });

};

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

};

exports.userWagerAdded = function (event) {

};

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

};

exports.userDestroyed = function (event) {

};