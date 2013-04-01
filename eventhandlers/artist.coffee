logger = require('../logger');
Order = require('../repositories/order').Order;
Wager = require('../repositories/wager').Wager;
Artist = require('../repositories/artist').Artist;

mongoose = require('mongoose');
_ = require('underscore');

exports.artistCreated = (event) ->
  logger.debug event
  artist = new Artist(event.payload);
  artist.save (err) ->
    logger.error "Error creating Artist: " + err if err
    logger.info "Artist Created"

exports.albumAdded = (event) ->
  logger.debug event
  Artist.findOne {_id:event.payload.id}, (err,artist) ->
    logger.error "error searching for artist: " + err if err
    if (artist)
      logger.debug "adding album: " + JSON.stringify(event.payload)+ "to artistId: " + artist._id
      newAlbum =
        id: event.payload.albumId
        _id: event.payload.albumId
        name: event.payload.name
        description: event.payload.description
        price: event.payload.price
        offerDate: event.payload.offerDate
      artist.albums.push newAlbum
      artist.save (err) ->
        logger.error "Error adding album: " + err if err
        logger.info "Album Saved"

