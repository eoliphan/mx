// Generated by CoffeeScript 1.6.1
(function() {
  var Artist, ObjectId, Order, Wager, logger, mongoose, _;

  logger = require('winston');

  Order = require('../repositories/order').Order;

  Wager = require('../repositories/wager').Wager;

  Artist = require('../repositories/artist').Artist;

  mongoose = require('mongoose');

  _ = require('underscore');

  ObjectId = mongoose.Types.ObjectId;

  exports.artistCreated = function(event) {
    var artist;
    logger.debug(event);
    artist = new Artist(event.payload);
    return artist.save(function(err) {
      if (err) {
        logger.error("Error creating Artist: " + err);
      }
      return logger.info("Artist Created");
    });
  };

  exports.albumAdded = function(event) {
    logger.debug(event);
    return Artist.findOne({
      _id: event.payload.id
    }, function(err, artist) {
      var newAlbum;
      if (err) {
        logger.error("error searching for artist: " + err);
      }
      if (artist) {
        logger.debug("adding album: " + JSON.stringify(event.payload) + "to artistId: " + artist._id);
        newAlbum = {
          id: event.payload.albumId,
          _id: event.payload.albumId,
          name: event.payload.name,
          description: event.payload.description,
          price: event.payload.price,
          offerDate: event.payload.offerDate,
          isActiveOffer: event.payload.isActiveOffer,
          offerId: event.payload.offerId
        };
        artist.albums.push(newAlbum);
        return artist.save(function(err) {
          if (err) {
            logger.error("Error adding album: " + err);
          }
          return logger.info("Album Saved");
        });
      }
    });
  };

  exports.albumUpdated = function(event) {
    logger.debug(event);
    return Artist.findOne({
      "albums._id": event.payload.itemId
    }, function(err, artist) {
      var album, newFields, updatedAlbum;
      if (err) {
        logger.error("Error updating album: " + err);
      }
      if (artist) {
        album = _.find(artist.albums, function(album) {
          return album._id.toString() === event.payload.itemId;
        });
        newFields = _.omit(event.payload, "id");
        updatedAlbum = _.extend(album, newFields);
        return artist.save(function(err, artist) {
          if (err) {
            return logger.error("Error updating artist" + err);
          }
        });
      } else {
        return logger.error("Artist Not Found");
      }
    });
  };

}).call(this);
