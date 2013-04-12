// Generated by CoffeeScript 1.6.1
(function() {
  var Order, Wager, logger, mongoose, _;

  logger = require('../logger');

  Order = require('../repositories/order').Order;

  Wager = require('../repositories/wager').Wager;

  mongoose = require('mongoose');

  _ = require('underscore');

  exports.chipWagerCreated = function(event) {
    var itemId, newWager, userId, wager;
    logger.debug(event);
    userId = mongoose.Types.ObjectId(event.payload.userId);
    itemId = mongoose.Types.ObjectId(event.payload.itemId);
    newWager = {
      userId: userId,
      itemId: itemId,
      chipCount: event.payload.chipCount,
      itemType: event.payload.itemType
    };
    wager = new Wager(event.payload);
    return wager.save(function(err) {
      if (err) {
        logger.error("error creating wager: " + err);
      }
      return logger.info("wager created");
    });
  };

  exports.chipWagerDestroyed = function(event) {
    return logger.debug(event);
  };

  exports.chipWagerChipsUpdated = function(event) {
    var price;
    logger.debug(event);
    price = event.payload.price;
    return Wager.find({
      itemId: event.payload.itemId,
      userId: event.payload.userId
    }, function(err, wagers) {
      if (err) {
        logger.error("error finding wagers: " + err);
      }
      if (wagers) {
        console.log("");
        return _.each(wagers, function(wager, index, list) {
          wager.chipCount = wager.chipCount + event.payload.chipCount;
          return wager.save(function(err) {
            if (err) {
              logger.error("error updating wager: " + err);
            }
            return logger.info("wager updated");
          });
        });
      }
    });
  };

}).call(this);
