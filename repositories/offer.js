var mongoose = require('mongoose')
    , Schema = mongoose.Schema
    , conf = require("../config").conf,
    ObjectId = Schema.Types.ObjectId;

/**
 * revenue schema
 *
 * 'denormalizing' for read path access
 * to the investor/investmet
 */
    //todo: generalize for all kinds of revenue
var revenueSchema = new Schema({
    orderId:ObjectId,
    investorId:ObjectId,
    earnedBy:ObjectId,
    investmentId:ObjectId,
    offeringId:ObjectId,
    offeringName:String,
    amount:Number,
    earnDate:Date,
    revenueType:{type:String, enum:['investor','offeror']}


});

var Revenue = mongoose.model('Revenue',revenueSchema);

exports.Revenue = Revenue;
var investmentSchema = new Schema({
    userId: Schema.Types.ObjectId,
    sharesPurchased: Number,
    pctOffering:Number, // what pct of the offering does this represent (for payout calc)
    purchaseDate: Date

});

var offerSchema = new Schema({
    artistName:String, //todo: this is too specific to sound scry
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
    sharesRemaining: Number, //todo: should be computed dynamically
    amtToRaise: Number,
    investments: [investmentSchema],
    name:String,
    price:Number


});

var Offer = mongoose.model('Offer',offerSchema);

exports.Offer = Offer;