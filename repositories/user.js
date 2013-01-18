var mongoose = require('mongoose')
    , Schema = mongoose.Schema
    , conf = require("../config").conf;

// connect to db
var connstring = "mongodb://"+conf.get('database:user')+":"+conf.get('database:password')+"@"+
    conf.get('database:host')+":"+conf.get('database:port')+"/"+conf.get('database:name');

console.log(connstring);
//var opts ={'user':conf.get('database:user'),'pass':conf.get('database:password')};
//mongoose.connect("mongodb://mxuser:mxusertest@linus.mongohq.com:10022/mxdemo");
mongoose.connect(connstring);


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
    annualIncome: String
});
var User = mongoose.model('User',userSchema);
// = mongoose.model('User');


exports.User = User;
exports.save=function(user) {

};

exports.findOne=function(id) {

};

