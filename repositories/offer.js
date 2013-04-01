var mongoose = require('mongoose')
    , Schema = mongoose.Schema
    , conf = require("../config").conf;

var investorSchema = new Schema({
    userId: Schema.Types.ObjectId,
    sharesPurchased: Number,
    purchaseDate: Date

});
var offerSchema = new Schema({
    artistName:String,
    bio:String,
    //albums:[album],
    userId:Schema.Types.ObjectId,
    itemId:Schema.Types.ObjectId,
    offerOpenDate: Date,
    pctOfferingToSell: Number,
    sharepct: Number,
    numShares: Number,
    sharePrice: {type:Number,get:function(val){
        return this.amtToRaise / this.numShares;
    }},
    sharesRemaining: Number,
    amtToRaise: Number,
    investors: [investorSchema],
    name:String,
    price:Number


});

var Offer = mongoose.model('Offer',offerSchema);

exports.Offer = Offer;