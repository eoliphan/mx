logger = require('../logger');
Order = require('../repositories/order').Order;
Wager = require('../repositories/wager').Wager;
Offer = require('../repositories/offer').Offer;
Revenue = require('../repositories/offer').Revenue;
Artist = require('../repositories/artist').Artist;



mongoose = require('mongoose');
_ = require('underscore');

ObjectId =mongoose.Types.ObjectId;
exports.orderBought = (event) ->
  logger.debug event
  Order.findOne {sessionId: event.payload.sessionId}, (err,order) ->
    #chnage from cart to order
    #todo cant just change as multiple buys in same session cause collision
    order.type = 'order'
    #order.sessionId = undefined
    order.sessOrd = parseInt(order.sessOrd) + 1
    nextSessOrd = order.sessOrd + 1
    #todo now do this here but need to handle chained events better
    #update wagers based on items

    _.each order.items, (item ,index ,list) ->
      itemId = item.itemId
      price = item.price
      orderDate
      if (!event.payload.orderDate)
        orderDate = new Date()
      else
        orderDate = event.payload.orderDate
      order.orderDate = orderDate
      # check for offers
      if item.isActiveOffer
        Offer.findOne {_id:item.offerId}, (err,offer) ->
          return logger.error "Error finding offer:" + err if err
          return logger.warn "No offer found : " + order if !offer
          _.each offer.investments, (investment,index,list) ->
            # look at the investment, figure the revenue share, create a revenue entry
            # figure out pct of the shares, then factor in division
            pctOfSale = (investment.sharesPurchased / offer.numShares) * (offer.pctOfferingToSell/100)
            revenueForSale = item.price * pctOfSale
            revenueForSale = Math.round(revenueForSale*100) / 100
            rev =
              orderId: order._id
              investorId: investment.userId
              offeringId: offer._id
              offeringName: offer.name
              amount: revenueForSale
              earnDate: orderDate

            newRev = new Revenue(rev)
            newRev.save()
            logger.debug("Revenue added: " + newRev)

      # update wagers
      Wager.find {itemId:itemId}, (err,wagers) ->
        logger.error "error finding wagers " + err if err
        if (wagers)
          _.each wagers, (wager,index,list) ->
            points = wager.points
            # stuff
            #todo serious concurrency issue here, with the 'upper' points calculation, maybe just summarize the history
            pointsThisEvent = (Math.round(price) * wager.chipCount)
            newPoints = points + pointsThisEvent;
            wager.points = newPoints
            wager.history.push({eventDate:orderDate,points:pointsThisEvent})
            wager.save (err) ->
              logger.error "error updating wager: " + err if err
              logger.info "wager updated"

    order.save (err) ->
      logger.error "Error buying order: " + err if err
      logger.info "Order purchased"
      #todo: this needs to be evented
      neworder = new Order({sessionId: event.payload.sessionId,type:'cart',sessOrd:nextSessOrd})
      neworder.save (err) ->
        logger.error "Error Creating Order" + err if err
        logger.info "Order Created"



exports.itemAddedToOrder = (event) ->
  logger.debug(event)
  #todo: TMI in event, enhance
  Artist.findOne {"albums._id":event.payload.itemId}, (err,artist) ->
    return logger.error "Error finding artist: " + err if err
    return logger.error "Artist not found" if (!artist)
    newItem = event.payload
    newItem.artistId = artist._id
    newItem.artistName = artist.artistName
    Order.findOneAndUpdate {sessionId: event.payload.sessionId}, {$push:{items:newItem}},(err,order) ->
      return logger.error "Error Adding Item to Order: " + err if err
      return logger.error "Order not found to update: " + event.payload if !order
  ###
  Order.findOne {sessionId: event.payload.sessionId}, (err,order) ->
    #logger.error ""
    # enhance the item with the artist id and name

    Artist.findOne {"albums._id":event.payload.itemId}, (err,artist) ->
      return logger.error "Error finding artist: " + err if err
      return logger.error "Artist not found" if (!artist)
      newItem = event.payload
      newItem.artistId = artist._id
      newItem.artistName = artist.artistName
      order.items.push event.payload
      order.save (err) ->
        logger.error "Error Adding Item To Order" + err if err
        logger.debug "Added Item to Order: " + event.payload

  ###


exports.orderCreated = (event) ->
  logger.debug(event);

  # seearch for existing orders for this session, in order to bump ordinal
  #Order.find {sessionId: event.payload.sessionId,type:cart}, null,{"sort":"sessOrd"}(err,orders) ->
  #  # grab highest
  #  highest = orders[orders.length-1]
  #  highSess = highest.sessOrd


  order = new Order(event.payload);
  order.save (err) ->
              logger.error "Error Creating Order" + err if err
              logger.info "Order Created"


exports.userAssignedToOrder = (event) ->
  logger.debug event
  Order.findOneAndUpdate {sessionId: event.payload.sessionId}, {userId:event.userId}, (err,order) ->
    logger.error "Error Updating Order with user id" + err if err


exports.orderDelete = (event) ->
  logger.debug event
  Order.findOneAndRemove {sessionId: event.payload.sessionId}, (err,order) ->
    logger.error "Error Deleting Order: " + err if err




