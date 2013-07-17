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
        #id: event.payload.albumId
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
    else
      logger.error "Artist for not found for event: " + JSON.stringify(event.payload)

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

#exports.albumUpdated = (event) ->
#  Artist.findOne {"albums._id":event.payload.albumId}, (err, artist) ->
#    logger.error "Error finding artist/album" if err
#    if artist
#      theAlbum = _.find artist.albums, (album) ->
#        return album._id.toString() == event.payload.albumId
#      # in this case replace everything but the id
#      albumNoId = _.omit(event.payload.album,"_id")
      # copy
#      theAlbum = _.extend(theAlbum,albumNoId);
#      logger.debug theAlbum

exports.songAddedToAlbum = (event) ->
  Artist.findOne {"albums._id":event.payload.albumId}, (err, artist) ->
    logger.error "Error finding artist/album" if err
    if artist
      theAlbum = _.find artist.albums, (album) ->
        return album._id.toString() == event.payload.albumId
      #todo add err handling
      theAlbum.songs.push event.payload.song
      artist.save (err,artist) ->
        logger.error "Error updating artist: " + err if err
    else
      logger.info "Artist not found"

findAlbumForSong = (albums,itemId) ->
  _.find albums, (album) ->
    return _.find album.songs, (song)  ->
      return song.itemId == itemId

findSong = (songs,itemId) ->
  _.find songs, (song) ->
    return song.itemId == itemId


exports.songUpdated = (event) ->
  logger.debug JSON.stringify(event)
  #Artist.update {}
  Artist.findOne {"albums.songs.itemId":event.payload.itemId}, (err,artist) ->
    logger.error "Error/finding artist album for event: " + event if err
    logger.debug JSON.stringify artist
    # super ugly, mongo positional updates via $ don't support more than one level of nesting
    # find the album
    #album = _.find artist.albums, (album) ->
    #  return _.find album.songs, (song)  ->
    #    return song.itemId == event.payload.itemId
    #song = _.find album.songs, (song) ->
    #  return song.itemId == event.payload.itemId
    album = findAlbumForSong artist.albums,event.payload.itemId
    song = findSong album.songs,event.payload.itemId
    # todo add error handling
    #update the song
    eventData = _.omit(event.payload,['itemId'])
    updatedSong = _.extend(song,eventData)
    artist.save (err)  ->
      logger.error "Error saving artist for event: " + event if err
    logger.debug album








