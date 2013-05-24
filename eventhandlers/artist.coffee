logger = require('winston');
Order = require('../repositories/order').Order;
Wager = require('../repositories/wager').Wager;
Artist = require('../repositories/artist').Artist;


mongoose = require('mongoose');
_ = require('underscore');
ObjectId = mongoose.Types.ObjectId;

exports.artistCreated = (event) ->
  logger.debug event
  artist = new Artist(event.payload);
  artist.save (err) ->
    logger.error "Error creating Artist: " + err if err
    logger.info "Artist Created"

exports.albumAdded = (event) ->
  logger.debug event
  Artist.findOne {_id: event.payload.id}, (err, artist) ->
    logger.error "error searching for artist: " + err if err
    if (artist)
      logger.debug "adding album: " + JSON.stringify(event.payload) + "to artistId: " + artist._id
      newAlbum =
        id: event.payload.albumId
        _id: event.payload.albumId
        name: event.payload.name
        description: event.payload.description
        price: event.payload.price
        offerDate: event.payload.offerDate
        isActiveOffer: event.payload.isActiveOffer
        offerId: event.payload.offerId
      # todo change to update
      artist.albums.push newAlbum
      artist.save (err) ->
        logger.error "Error adding album: " + err if err
        logger.info "Album Saved"

exports.albumUpdated = (event) ->
  logger.debug event
  Artist.findOne {"albums._id": event.payload.itemId}, (err, artist)->
    logger.error "Error updating album: " + err if err
    if artist
      #dosomething
      album = _.find artist.albums, (album) ->
        return album._id.toString() == event.payload.itemId
      # copy fields over, drop the id
      newFields = _.omit event.payload, "id"
      updatedAlbum = _.extend album, newFields
      artist.save (err, artist) ->
        logger.error "Error updating artist" + err if err

    else
      logger.error "Artist Not Found"

exports.songAddedToAlbum = (event) ->
  Artist.findOne {}, (err, artist) ->
    logger.error "Error finding artist/album" if err
    if artist
      album = _.find artist.albums, (album) ->
        return album._id.toString() == event.payload.itemId
    else
      logger "Artist not found"




