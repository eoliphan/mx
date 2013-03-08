var mongoose = require('mongoose')
    , Schema = mongoose.Schema
    , conf = require("../config").conf;

//-- game stuff
var chipWagerSchema = new Schema({
    userId:Schema.Types.ObjectId,
    orderDate:Date,
    chipCount:Number,
    points:Number,
    itemId:Schema.Types.ObjectId
});

var Wager = mongoose.model('Wager',chipWagerSchema);

exports.Wager = Wager;
