var Order  = require("../repositories/order").Order,
    Artist = require("../repositories/artist").Artist,
    mongoose = require('mongoose'),
    logger = require("../logger"),
    _ = require('underscore'),
    uuid = require('node-uuid'),
    evtcmdbus = require('../evtcmdbus'),
    async = require("async");


//todo: refactor to newer route handling apporach

function validateCart(req,res) {
    if(!req.session.order) {
            // check the db
            Order.findOne({sessionId:req.session.id,type:'cart'},function(err,order){
                if(order) {
                    req.session.order = order;
                }
                else {
                    var newId = uuid.v4();

                    var command = {
                        id:newId,
                        command:"createOrder",

                        payload: {
                            sessionId:req.session.id
                        }
                    }
                    evtcmdbus.emitCommand(command);

                }
            });
        }
}
exports.addToCart = function(req,res){
    // do we have a cart?
    if (!req.session.cart) {
        req.session.cart = new Order({sessionId:req.session.id, items:[],status:"order"});
    }
    var itemInfo = req.body;
    var cart = req.session.cart;
    var albumId = mongoose.Types.ObjectId(itemInfo.itemId);
    //cart.items.push(item);
    Artist.aggregate(
        {$match: {'albums._id':albumId}},
                    {$project:{
                    'artistName':1,
                    'bio': 1,
                    'albums' : 1
                }},
                {$unwind: "$albums"},
            function(err,artists){
                            if (!err) {
                                //TODO: clunky to have to filter here

                                var artist = _.find(artists,function(element){
                                    return (element.albums._id == itemInfo.itemId)
                                });
                                //res.render("albumdetail",{title:"Title",info:artist});
                                cart.items.push({
                                    itemId: artist.albums._id,
                                    itemType: "album",
                                    name: artist.albums.name,
                                    price: artist.albums.price
                                });
                                logger.debug(JSON.stringify(cart));
                            }
                            else
                            {
                                loger.error(err);
                                res.send(404);
                            }
    });


};

exports.getCart = function(req,res) {
    res.render("cart",{title:"Cart",user:req.user});

};

exports.getCartData = function(req,res) {

    Order.findOne({sessionId:req.session.id,type:"cart"},function(err,order){
        if (err) {
            res.send(400);
        } else {
            if (order) {
                res.send(order);
            } else {
                res.send({});
            }
        }



    });



};

exports.getCartSize = function(req,res) {
    validateCart(req,res);
    Order.findOne({sessionId:req.session.id,type:"cart"}, function(err,order){
        if(err) {
            res.send(404);

        } else {
            var ret = {
                cartSize: (!order ? 0 : order.items.length)
            };
            res.send(ret);
        }

    });
}

exports.buyNow = function(req,res) {

}

exports.clearFromSession = function(req,res){

};