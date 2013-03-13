var mongoose = require('mongoose')
    , Schema = mongoose.Schema
    , conf = require("../config").conf;

//-- game stuff
var chipWagerSchema = new Schema({
    userId:Schema.Types.ObjectId,
    orderDate:Date,
    chipCount:{type:Number,default:0},
    points:{type:Number,default:0},
    itemId:Schema.Types.ObjectId,
    itemType:{type:String,enum:['album','song']}
});

var Wager = mongoose.model('Wager',chipWagerSchema);

exports.Wager = Wager;
