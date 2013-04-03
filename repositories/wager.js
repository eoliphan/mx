var mongoose = require('mongoose')
    , Schema = mongoose.Schema
    , conf = require("../config").conf;

//-- game stuff

// for historical cumlative trending, for now part of the overall wager but might need to break out
var chipWagerHistorySchema = new Schema({
    eventDate:Date, // todo: defalut to now
    points:Number // points as a result of the event, simple for now just go up.

});
var chipWagerSchema = new Schema({
    userId:Schema.Types.ObjectId,
    userAlias: String,
    orderDate:Date,
    wagerDate:Date, // when placed
    chipCount:{type:Number,default:0},
    points:{type:Number,default:0},
    name:String,
    itemId:Schema.Types.ObjectId,
    itemType:{type:String,enum:['album','song']},
    history:[chipWagerHistorySchema]
});

var Wager = mongoose.model('Wager',chipWagerSchema);

exports.Wager = Wager;
