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


var song = new Schema({
    name:String,
    genre:String,
    releaseDate:Date,
    price:Number
});
var album = new Schema({
    name:String,
    genre:String,
    price:Number,
    releaseDate:Date,
    songs:[song]
});

var artistSchema = new Schema({
    artistName:String,
    bio:String,
    albums:[album]
});
var Artist = mongoose.model('Artist',artistSchema);
// = mongoose.model('User');


exports.Artist = Artist;
exports.save=function(user) {

};

exports.findOne=function(id) {

};
