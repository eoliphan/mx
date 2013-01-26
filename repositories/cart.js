var mongoose = require('mongoose')
    , Schema = mongoose.Schema
    , conf = require("../config").conf;

// connect to db
var connstring = "mongodb://"+conf.get('database:user')+":"+conf.get('database:password')+"@"+
    conf.get('database:host')+":"+conf.get('database:port')+"/"+conf.get('database:name');

console.log(connstring);
//var opts ={'user':conf.get('database:user'),'pass':conf.get('database:password')};
//mongoose.connect("mongodb://mxuser:mxusertest@linus.mongohq.com:10022/mxdemo");
if (!mongoose.connection.readyState)
    mongoose.connect(connstring);


var cartItemSchema = new Schema({
    itemId:String,
    itemType:String,
    name:String,

    price:Number
});

var CartItem = mongoose.model('cartItem',cartItemSchema);
// = mongoose.model('User');


exports.CartItem = CartItem;
exports.save=function(user) {

};

exports.findOne=function(id) {

};

