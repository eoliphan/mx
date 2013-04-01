logger = require('../logger');
Order = require('../repositories/order').Order;
Wager = require('../repositories/wager').Wager;
Artist = require('../repositories/artist').Artist;
Offer = require('../repositories/offer').Offer;
uuid = require('node-uuid')
evtcmdbus = require('../evtcmdbus')


#todo: decide on approach for sending new commands Is from evt handlers ok?

mongoose = require('mongoose');
_ = require('underscore');

ObjectId =mongoose.Types.ObjectId;

exports.offerCreated = (event) ->
  logger.debug event
  # we need to create an associated album for the artist in question
  # assuming 1 artist per id at the moment.
  Artist.findOne {userId:event.payload.userId}, (err,artist) ->
    #todo this shoulld more properly go into a saga
    logger.error "Error finding artist: " + err if err
    if (!artist)
      logger.error "Artist not found"
    else
      newAlbumId = ObjectId()
      # pull out the album data
      createAlbumCmd =
        id:uuid.v4()
        command: "addAlbum"
        payload:
          id: artist._id
          albumId: newAlbumId
          name: event.payload.name
          description: event.payload.description
          price: event.payload.price
          offerDate: new Date()
      evtcmdbus.emitCommand createAlbumCmd
      offerData = event.payload
      offerData.itemId = newAlbumId
      offer = new Offer(event.payload);
      offer.save (err) ->
        logger.error "Error creating offer: " + err if err
        logger.info "Offer Created"
