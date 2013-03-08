logger = require('../logger');
Order = require('../repositories/order').Order;
Wager = require('../repositories/wager').Wager;

_ = require('underscore')

exports.orderBought = (event) ->
  logger.debug event
  Order.findOne {sessionId: event.payload.sessionId}, (err,order) ->
    #chnage from cart to order
    order.type = 'order'
    order.sessionId = undefined
    #todo now do this here but need to handle chained events better
    #update wagers based on items
    _.each order.items, (item ,index ,list) ->
      itemId = item.itemId
      price = item.price
      Wager.find {itemId:itemId}, (err,wagers) ->
        logger.error "error finding wagers " + err if err
        if (wagers)
          _.each(wagers) (wager,index,list) ->
            points = wager.points
            # stuff

            wager.points = points + (price * (wager.chipCount/100))
            wager.save (err) ->
              logger.error "error updating wager: " + err if err
              logger.info "wager updated"

    order.save (err) ->
      logger.error "Error buying order" if err
      logger.info "Order purchased"
      #todo: this needs to be evented
      order = new Order({sessionId: event.payload.sessionId})
      order.save (err) ->
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
  order = new Order(event.payload);
  order.save((err) ->
              logger.error "Error Creating Order" + err if err
              logger.info "Order Created"
            )

exports.userAssignedToOrder = (event) ->
  logger.debug event
  Order.findOneAndUpdate {sessionId: event.payload.sessionId}, {userId:event.userId}, (err,order) ->
    logger.error "Error Updating Order with user id" + err if err


exports.orderDelete = (event) ->
  logger.debug event
  Order.findOneAndRemove {sessionId: event.payload.sessionId}, (err,order) ->
    logger.error "Error Deleting Order: " + err if err




