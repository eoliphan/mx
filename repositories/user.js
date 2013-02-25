var mongoose = require('mongoose')
    , Schema = mongoose.Schema
    , conf = require("../config").conf;

// connect to db

var lineItemSchema = new Schema({

    itemId:Schema.Types.ObjectId,
    itemVersion:String,
    itemType:String,
    name:String,
    price:Number,
    quantity:Number
});
//--
var orderSchema = new Schema({
    userId:Schema.Types.ObjectId,
    orderDate:Date,
    items:[lineItemSchema]

});

var Order = mongoose.model('Order',orderSchema);
exports.Order = Order;

//-- game stuff
var chipWagerSchema = new Schema({
    userId:Schema.Types.ObjectId,
    orderDate:Date,
    chipCount:Number,
    points:Number,
    itemId:Schema.Types.ObjectId
});

var userSchema = new Schema({
    firstName: String,
    lastName: String,
    email: String,
    password: String,
    address1: String,
    address2: String,
    city: String,
    state: String,
    ssn: String,
    annualIncome: String,
    isArtist:{type:Boolean, default: false},
    isInvestor:{type:Boolean, default: false},
    primaryuse: String,
    bandName:String,
    bandContactPhone:String,
    phoneNumber:String,
    companyName:String,
    investorClass:String,
    ssn:String,
    einTaxID:String,
    chipWagers:[chipWagerSchema],
    orders:[orderSchema]

});
var User = mongoose.model('User',userSchema);

exports.User = User;


var cartSchema = new Schema({
    sessionId:String,
    userId:Schema.Types.ObjectId,
    items:[lineItemSchema],
    active:Boolean
});
var Cart = mongoose.model('Cart',cartSchema);
exports.Cart = Cart;





