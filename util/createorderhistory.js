var orderHandlers = require('../eventhandlers/order');
var Order = require('../repositories/order').Order;
var Artist = require('../repositories/artist').Artist;

var mongoose = require('mongoose');
var _ = require('underscore');
var conf = require('../config').conf;
var moment = require('moment');
var uuid = require('node-uuid');


//-- setup dbs
var connstring = "mongodb://"+conf.get('database:user')+":"+conf.get('database:password')+"@"+
    conf.get('database:host')+":"+conf.get('database:port')+"/"+conf.get('database:name');

console.log(connstring);
//var opts ={'user':conf.get('database:user'),'pass':conf.get('database:password')};
//mongoose.connect("mongodb://mxuser:mxusertest@linus.mongohq.com:10022/mxdemo");
mongoose.connect(connstring);

// todo create
// find matching artists
var  regExp = new RegExp('New Offering.*')
function createOrderForDate(album,orderDate) {
// create order
    var sessId = uuid.v4();
    var evt = {};
    evt.payload = {};
    evt.payload.sessionId = sessId;
    orderHandlers.orderCreated(evt);
    // add item
    var evt1 = {};
    evt1.payload = {};
    evt1.payload.itemType = "album";
    evt1.payload.itemId = album._id;
    evt1.payload.name = album.name;
    evt1.payload.price = album.price;
    evt1.payload.sessionId = sessId;
    setTimeout(function () {
        orderHandlers.itemAddedToOrder(evt1);
        var evt2 = {};
        evt2.payload = {};
        evt2.payload.ccnum = "123";
        evt2.payload.seccode = "123";
        evt2.payload.nameOnCard = "erich";
        evt2.payload.sessionId = sessId;
        evt2.payload.orderDate = orderDate;
        setTimeout(function () {
            orderHandlers.orderBought(evt2);
        }, 500)
    }, 500);
}
Artist.findOne({'albums.name':regExp},function(err,artist){
    console.log(JSON.stringify(artist));
    var albums = _.filter(artist.albums,function(album){
       return regExp.test(album.name);
    });
    console.log(JSON.stringify(albums));

    _.each(albums,function(album,index,list){
        var orderDate = new Date(2009,11,11);
        createOrderForDate(album,moment().subtract('days',3).toDate());
        createOrderForDate(album,moment().subtract('days',15).toDate());
        createOrderForDate(album,moment().subtract('months',6).toDate());
    });









});


