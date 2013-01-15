var mongoose = require('mongoose')
    , Schema = mongoose.Schema;

// connect to db
mongoose.connect("mongodb://mxuser:mxusertest@linus.mongohq.com:10022/mxdemo");


var userSchema = new Schema({
    firstName: String,
    lastName: String,
    email: String,
    password: String
});
mongoose.model('User',userSchema);
var User = mongoose.model('User');



exports.save=function(user) {

};

exports.findOne=function(id) {

};