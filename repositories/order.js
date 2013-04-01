var mongoose = require('mongoose')
    , Schema = mongoose.Schema
    , conf = require("../config").conf;

//// connect to db
//var connstring = "mongodb://"+conf.get('database:user')+":"+conf.get('database:password')+"@"+
//    conf.get('database:host')+":"+conf.get('database:port')+"/"+conf.get('database:name');
//
//console.log(connstring);
////var opts ={'user':conf.get('database:user'),'pass':conf.get('database:password')};
////mongoose.connect("mongodb://mxuser:mxusertest@linus.mongohq.com:10022/mxdemo");
//if (!mongoose.connection.readyState)
//    mongoose.connect(connstring);
var lineItemSchema = new Schema({

    itemId:Schema.Types.ObjectId,
    itemVersion:String,
    itemType:String,
    name:String,
    price:Number,
    quantity:Number,
        artistId:Schema.Types.ObjectId
});
//--
var orderSchema = new Schema({
    sessionId:String,
    sessOrd:{type:Number,default:0},
    type:{type:String,enum:['cart','order'],default:"cart"},
    userId:Schema.Types.ObjectId,
    orderDate:Date,
    items:[lineItemSchema],
    ccnum: String

});

orderSchema.index({sessionId:1,type:1,sessOrd:1},{unique:true});
orderSchema.index({userId:1});
orderSchema.index({type:1});
orderSchema.index({orderDate:1});


var Order = mongoose.model('Order',orderSchema);
exports.Order = Order;

var cartSchema = new Schema({
    sessionId:String,
    userId:Schema.Types.ObjectId,
    items:[lineItemSchema],
    active:Boolean
});
var Cart = mongoose.model('Cart',cartSchema);
exports.Cart = Cart;

