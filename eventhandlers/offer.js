// Generated by CoffeeScript 1.6.1
(function() {
  var Artist, ObjectId, Offer, Order, Wager, evtcmdbus, logger, mongoose, uuid, _;

  logger = require('winston');

  Order = require('../repositories/order').Order;

  Wager = require('../repositories/wager').Wager;

  Artist = require('../repositories/artist').Artist;

  Offer = require('../repositories/offer').Offer;

  uuid = require('node-uuid');

  evtcmdbus = require('../evtcmdbus');

  mongoose = require('mongoose');

  _ = require('underscore');

  ObjectId = mongoose.Types.ObjectId;

  exports.offerCreated = function(event) {
    logger.debug(event);
    return Artist.findOne({
      userId: event.payload.userId
    }, function(err, artist) {
      var createAlbumCmd, newAlbumId, newOfferId, offer, offerData;
      if (err) {
        logger.error("Error finding artist: " + err);
      }
      if (!artist) {
        return logger.error("Artist not found");
      } else {
        newAlbumId = ObjectId();
        newOfferId = ObjectId();
        createAlbumCmd = {
          id: uuid.v4(),
          command: "addAlbum",
          payload: {
            id: artist._id,
            albumId: newAlbumId,
            name: event.payload.name,
            description: event.payload.description,
            price: event.payload.price,
            offerDate: new Date(),
            isActiveOffer: true,
            offerId: newOfferId
          }
        };
        evtcmdbus.emitCommand(createAlbumCmd);
        offerData = event.payload;
        offerData.itemId = newAlbumId;
        offer = new Offer(event.payload);
        return offer.save(function(err) {
          if (err) {
            logger.error("Error creating offer: " + err);
          }
          return logger.info("Offer Created");
        });
      }
    });
  };

  exports.investmentAddedToOffer = function(event) {
    logger.debug("Handling: " + event);
    return Offer.findOneAndUpdate({
      _id: event.payload.offerId
    }, {
      $push: {
        investments: event.payload
      }
    }, function(err, offer) {
      if (err) {
        return logger.error("Error adding investment to offer: " + err);
      }
      if (!offer) {
        return logger.error("Offer not found for " + event.payload);
      }
    });
  };

}).call(this);
