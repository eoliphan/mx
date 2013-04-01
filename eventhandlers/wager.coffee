logger = require('../logger');
Order = require('../repositories/order').Order;
Wager = require('../repositories/wager').Wager;
mongoose = require('mongoose')
_ = require('underscore');


exports.chipWagerCreated = (event) ->
  logger.debug event
  userId = mongoose.Types.ObjectId(event.payload.userId)
  itemId = mongoose.Types.ObjectId(event.payload.itemId)
  newWager  = {
    userId: userId,
    itemId: itemId,
    chipCount: event.payload.chipCount,
    itemType: event.payload.itemType
  }
  wager = new Wager(event.payload)
  wager.save (err) ->
    logger.error "error creating wager: " + err if err
    logger.info "wager created"

exports.chipWagerDestroyed = (event) ->
  logger.debug event


exports.chipWagerChipsUpdated = (event) ->
  logger.debug event
  price = event.payload.price
  Wager.find {itemId:event.payload.itemId,userId:event.payload.userId}, (err,wagers) ->
    logger.error "error finding wagers: "+ err if err
    if wagers
      # prc
      console.log("")
      _.each wagers, (wager,index,list) ->
        #curPoints = wager.points
        #wager.points = curPoints + (price * (wager.chipCount/100))
        wager.chipCount = wager.chipCount + event.payload.chipCount
        wager.save (err) ->
          logger.error "error updating wager: " + err if err
          logger.info "wager updated"

#exports.orderBought = (event) ->






