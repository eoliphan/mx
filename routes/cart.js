var Cart  = require("../repositories/user").Cart,
    Artist = require("../repositories/artist").Artist,
    mongoose = require('mongoose'),
    _ = require('underscore');

exports.addToCart = function(req,res){
    // do we have a cart?
    if (!req.session.cart) {
        req.session.cart = new Cart({sessionId:req.session.id, items:[]});
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
                                console.log(JSON.stringify(cart));
                            }
                            else
                            {
                                console.log(err);
                                res.send(404);
                            }
    });


};

exports.getCart = function(req,res) {
    if(req.session.cart) {
        res.send(req.session.cart);
    }
    else
        res.send(404);

};

exports.buyNow = function(req,res) {

}

exports.clearFromSession = function(req,res){

};