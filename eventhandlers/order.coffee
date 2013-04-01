logger = require('../logger');
Order = require('../repositories/order').Order;
Wager = require('../repositories/wager').Wager;
Offer = require('../repositories/offer').Offer;

_ = require('underscore')

exports.orderBought = (event) ->
  logger.debug event
  Order.findOne {sessionId: event.payload.sessionId}, (err,order) ->
    #chnage from cart to order
    #todo cant just change as multiple buys in same session cause collision
    order.type = 'order'
    #order.sessionId = undefined
    order.sessOrd = parseInt(order.sessOrd) + 1
    #todo now do this here but need to handle chained events better
    #update wagers based on items

    _.each order.items, (item ,index ,list) ->
      itemId = item.itemId
      price = item.price
      Wager.find {itemId:itemId}, (err,wagers) ->
        logger.error "error finding wagers " + err if err
        if (wagers)
          _.each wagers, (wager,index,list) ->
            points = wager.points
            # stuff

            wager.points = points + (Math.round(price) * wager.chipCount)
            wager.save (err) ->
              logger.error "error updating wager: " + err if err
              logger.info "wager updated"
    order.orderDate = new Date()
    order.save (err) ->
      logger.error "Error buying order: " + err if err
      logger.info "Order purchased"
      #todo: this needs to be evented
      neworder = new Order({sessionId: event.payload.sessionId,type:'cart'})
      neworder.save (err) ->
        logger.error "Error Creating Order" + err if err
        logger.info "Order Created"



exports.itemAddedToOrder = (event) ->
  logger.debug(event)
  #todo: TMI in event, enhance
  Order.findOne {sessionId: event.payload.sessionId}, (err,order) ->
    #logger.error ""
    order.items.push event.payload
    order.save (err) ->
      logger.error "Error Adding Item To Order" + err if err
      logger.debug "Added Item to Order: " + event.payload


exports.orderCreated = (event) ->
  logger.debug(event);

  # seearch for existing orders for this session, in order to bump ordinal
  Order.find {sessionId: event.payload.sessionId,type:cart}, null,{"sort":"sessOrd"}(err,orders) ->
    # grab highest
    highest = orders[orders.length-1]
    highSess = highest.sessOrd


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




