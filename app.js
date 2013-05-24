/**
 * Module dependencies.
 */
// - end schema
require('nodetime').profile({
    accountKey: '0e70635ffc6e0abdd3e4ae80e85fd15a9a4c1749',
    appName: 'Scry Application'
});
var express = require('express');
var app = express();
//hub.app = app;

ensureAuthenticated = function (req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect('/login')
};

var http = require('http')
    , path = require('path')
    , passport = require('passport')
    , mongoose = require('mongoose')
    , Schema = mongoose.Schema
    , ObjectId =mongoose.Types.ObjectId
    , LocalStrategy = require('passport-local').Strategy
    , querystring = require('querystring')
    , domain = require("./domain/domain")
    , passportSocketIo = require("passport.socketio")
    , uuid = require('node-uuid')
    , conf = require('./config').conf
    , userrepo = require("./repositories/user")
    , flash = require('connect-flash')
    , User = require("./repositories/user").User
    , Order = require("./repositories/order").Order
    , Artist = require("./repositories/artist").Artist
    , _ = require('underscore')

    cart = require("./routes/cart"),
    game = require("./routes/game")
//routes = require('./routes')
    , user = require('./routes/user')
    , demoweb = require('./routes/demoweb')


    , logger = require("winston"),
    connect = require("connect"),
    moment = require('moment')
    , coffeescript = require("coffee-script")
    , upload = require('jquery-file-upload-middleware')
    , gridfs =  require('gridfs-stream')
    , fs = require("fs")
    , passportconf = require('./util/passportconf')
    , awsfilestore = require('./services/awsfilestore')
    , mongosetup = require('./util/mongosetup')
    ;





var issueSchema = new Schema({
    userId: String,
    projectName: String,
    amountRequired: Number,
    noOfShares: Number,
    singleInvestorMax: Number,
    description: String,
    photoPath: String

});
mongoose.model("Issue", issueSchema);
var Issue = mongoose.model("Issue");

var mongoconf = conf.get('database');
mongosetup.init(mongoconf);
//-- setup dbs
/*
var connstring = "mongodb://" + conf.get('database:user') + ":" + conf.get('database:password') + "@" +
    conf.get('database:host') + ":" + conf.get('database:port') + "/" + conf.get('database:name');

console.log(connstring);
//var opts ={'user':conf.get('database:user'),'pass':conf.get('database:password')};
//mongoose.connect("mongodb://mxuser:mxusertest@linus.mongohq.com:10022/mxdemo");
var gfs;

var conn = mongoose.connect(connstring);

mongoose.connection.once("open",function(conn){
     gfs = gridfs(mongoose.connection.db,mongoose.mongo);
    console.log(conn);
});
*/
//-- end setup dbs


var evtcmdbus = require('./evtcmdbus')
    , evthandlers = require("./loadeventhandlers")
    ;



app.configure('development', function () {
    app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
});

app.configure('production', function () {
    app.use(express.errorHandler());
});
store = new express.session.MemoryStore;
app.configure(function () {
    app.set('port', process.env.PORT || 3000);
    app.set('views', __dirname + '/views');
    app.set('view engine', 'jade');
    app.set('view options', { pretty: true });
    app.locals.pretty = true;

    app.use(express.favicon(__dirname + '/public/images/favicon.ico'));
    app.use(express.logger('dev'));


    app.use(express.bodyParser({ uploadDir: __dirname + '/public/uploads' }));
    app.use(express.methodOverride());
    app.use(express.cookieParser('secret'));
    app.use(express.session({ secret: 'secret', store: store }));
    app.use(passport.initialize());
    app.use(passport.session());
    app.use(flash());
    //todo: reevaluate, express seemed to be properly caching but results weren't always returned by cache in browser
    app.use(function (req, res, next) {
            if (req.url.match("^/api")) {
                //res.locals.user = req.user;
                //make sure we don't cache the response
                res.setHeader("Expires", "-1");
                res.setHeader("Cache-Control", "must-revalidate, private, max-age=0, no-store");
                res.setHeader("ETag", uuid.v4());
            }
            next();
        });
    app.use(app.router);


    //-- custom middleware
    app.use(function (req, res, next) {
        if (req.user)
            res.locals.user = req.user;
        next();
    });
    //- keep browser from caching api results as it seems to cause problems


    app.use(express.static(path.join(__dirname, 'public')));
});

app.configure('development', function () {
    app.use(express.errorHandler());
});

//-- domain
// init domain
domain.initDomain();
// send message to domain


for (var i = 0; i < 1; i++) {
    var newUuid = uuid.v4();
    var objId = uuid.v4();
//    //domain.domain.handle({id:newUuid,command:"createUser",payload:{id:objId,email:"e@e.com",password:"blah"}});
    domain.domain.handle({id: newUuid, command: "changeUserPassword", payload: {id: "50f845e01d3435931b000001", email: "e@e.com", password: objId}});
}


/// -- routes

/*app.get('/', function (req, res) {
    res.redirect("/demoweb");
});*/




app.get('/demoweb', demoweb.index);
app.get('/profile', ensureAuthenticated, demoweb.profile);
app.get('/profile/*', ensureAuthenticated, demoweb.profile);
app.get('/profile/detail', ensureAuthenticated, demoweb.profiledetail);
app.get('/artist', ensureAuthenticated, demoweb.artist);

app.get('/artistinfo', demoweb.artistinfo);
app.get('/investorinfo', demoweb.investorinfo);
app.get('/musicloverinfo', demoweb.musicloverinfo);


app.get('/fragments/:frag', ensureAuthenticated, function (req, res) {
    User.findById(req.user._id, function (err, user) {
        if (err) res.send(400);
        else
            res.render("fragments/" + req.params.frag, {user: user});
    });

});
app.get('/users', user.list);
// - ecommerce
app.get('/store', demoweb.store);
app.post('/cart/item', cart.addToCart);
app.get('/cart', cart.getCart);
app.post('/buynow/item', cart.addToCart);

//- game
app.post('/user/chips/item', game.addChips);


app.get('/cart', demoweb.cart);
app.get('/about', demoweb.about);
app.get('/contact', demoweb.contact);

// -- utility
app.get('/util/rndsmlcvr/:rnd', function (req, res) {
    var images = ["http://ecx.images-amazon.com/images/I/51Jc2v9ndpL._SL500_AA300_.jpg",
        "http://ecx.images-amazon.com/images/I/61e3FaHueCL._SL500_AA300_.jpg",
        "http://ecx.images-amazon.com/images/I/61iKyNi5UKL._SL500_AA300_.jpg",
        "http://ecx.images-amazon.com/images/I/41ZsWDiEvfL._SL500_AA300_.jpg",
        "http://ecx.images-amazon.com/images/I/61DAJ0zqFhL._AA160_.jpg",
        "http://ecx.images-amazon.com/images/I/51Xb620XzWL._AA160_.jpg",
        "http://ecx.images-amazon.com/images/I/5135bFFBrWL._AA160_.jpg",
        "http://ecx.images-amazon.com/images/I/51DcM7PBuhL._AA160_.jpg"]
    res.redirect(images[Math.floor(Math.random() * images.length)]);
});

//TODO: Refactor api's to module/route
// -- api mappings
app.get('/api/checkemail', function (req, res) {
    console.log(req.value);
});

app.get('/api/session/user', ensureAuthenticated, function (req, res) {
    userrepo.User.findById(req.user._id, function (err, user) {
        if (err) res.send(400);
        var jsonData = JSON.stringify(user);
        res.send(jsonData);
    });
});
app.get('/api/cart', cart.getCartData);

app.get('/api/cartsize', cart.getCartSize);

app.put('/api/user/:id', function (req, res) {
    console.log(req.params.id);
    console.log(req.body);
    var body = req.body;
    var objId = mongoose.Types.ObjectId(req.params.id);
    delete body._id;
    delete body.email;

    userrepo.User.update({_id: objId}, {$set: body}, function (err, numAffected, raw) {
        if (err)
            res.send(400);
        else
            res.send(200);
    });

});

app.post('/api/issue', function (req, res) {
    console.log(req.params.id);
    console.log(req.body);
    var body = req.body;
    body.userId = req.user._id;
    // handle uploaded file
    var tmpPath = req.files.photo.path;
    var newUuid = uuid.v4();
    var tgtPath = '.public/images/issues/' + newUuid;
    body.photoPath = tgtPath;
    fs.rename(tmpPath, tgtPath, function (err) {
        if (err) throw err;
        fs.unlink(tmpPath, function () {
            if (err) throw err;

        });
    });
    var issue = new Issue(body);
    issue.save(function (err) {
        console.log('saving');
        if (err)
            res.send(400);
        else
            res.redirect("/profile");
    });


});
app.get('/api/issues', function (req, res) {
    return Issue.find(function (err, issues) {
        if (!err) {
            return res.send(issues);
        } else {
            return console.log(err);
        }
    });
});


app.get('/api/songs', function (req, res) {

    Artist.aggregate({$project: {
            'artistName': 1,
            'bio': 1,
            'albums': 1
        }},
        {$sort: {_id: -1}},
        {$unwind: "$albums"},
        {$limit: 50},
        function (err, artists) {
            if (!err)
                res.send(artists);
            else {
                console.log(err);
                res.send(404);
            }

        });

});

app.get('/api/songs/new', function (req, res) {

    var curDate = new moment();
    curDate.subtract('days', 14);

    Artist.aggregate(
        {$match: {"albums.offerDate": {$gte: curDate.toDate() }}},
        {$project: {
            'artistName': 1,
            'bio': 1,
            'albums': 1
        }},
        {$unwind: "$albums"},
        {$limit: 50},
        function (err, artists) {
            if (!err)
                res.send(artists);
            else {
                console.log(err);
                res.send(404);
            }

        });

});

app.get('/api/songs/bygenre/:genre', function (req, res) {
    Artist.find()
        .limit(50)
        .select('albums.songs')
        .where('albums.songs.genre').equals(req.params.genre)
        .exec(function (err, artists) {
            if (!err)
                res.send(artists);
            else {
                console.log(err);
                res.send(404);
            }

        });
});


var x = require("./routes")(app);
//-- end routes


var server = http.createServer(app).listen(app.get('port'), function () {
    console.log("Express server listening on port " + app.get('port')
        + ":" + app.get('env'));
});

// setup socket io
var io = require('socket.io').listen(server);
io.set('log level', 1);
//io.set("authorization", passportSocketIo.authorize({
//    //sessionKey:    'connect.sid',      //the cookie where express (or connect) stores its session id.
//    store:  store,     //the session store that express uses
//    secret: "secret", //the session secret to parse the cookie
//    fail: function(data, accept) {     // *optional* callbacks on success or fail
//      accept(null, false);             // second param takes boolean on whether or not to allow handshake
//    },
//    success: function(data, accept) {
//      accept(null, true);
//    }
//}));

//todo: must add filter or something for messages that require auth (whitelisitng?)
io.of('/auth').authorization(passportSocketIo.authorize({
        //sessionKey:    'connect.sid',      //the cookie where express (or connect) stores its session id.
        store: store,     //the session store that express uses
        secret: "secret", //the session secret to parse the cookie
        fail: function (data, accept) {     // *optional* callbacks on success or fail
            accept(null, false);             // second param takes boolean on whether or not to allow handshake
        },
        success: function (data, accept) {
            accept(null, true);
        }
    })).on('connection', function (socket) {
        logger.info(socket);
        socket.on('command', function (data) {
            logger.debug(data);
        });

    });
var parseSignedCookies = require('connect').utils.parseSignedCookies
io.set('authorization', function (data, accept) {
    if (data.headers.cookie) {
        data.cookie = require('cookie').parse(data.headers.cookie);
        data.cookie = parseSignedCookies(data.cookie, 'secret');
        data.sessionId = data.cookie['connect.sid'];
        data.randdata = 'test';
    } else {
        return accept('No Cookie Transmitted', false);
    }
    accept(null, true);

});

//todo: needs to go to redis for clustering next rev
clients = {};
evtcmdbus.addEventSink(function (event) {
    if (event.payload.sessionId && clients[event.payload.sessionId])
        clients[event.payload.sessionId].emit(event.event, event.payload);
});
io.sockets.on('connection', function (socket) {
    //console.log("Socket established: " + socket);
    clients[socket.handshake.sessionId] = socket;

    socket.on('disconnect', function () {
        delete clients[socket.handshake.sessionId];
    });


    socket.on('message', function (data) {
        console.log('received generic:');
        console.log(data);
        var newIssueData = querystring.parse(data.data);


        console.log(newIssueData);

    });
    socket.on('command', function (data) {
        logger.debug('received command:' + JSON.stringify(data));
        data.payload.sessionId = socket.handshake.sessionId;
        evtcmdbus.emitCommand(data);
        //logger.debug(data);
        //var commandData = querystring.parse(data.data);
        //var newUuid = uuid.v4();
        //console.log(commandData);
        //domain.domain.handle({id:newUuid,command:data.command,payload:commandData});


    });
    socket.on('createUser', function (data) {
        console.log('received:');
        console.log(data);
        var newIssueData = querystring.parse(data.data);


        console.log(newIssueData);

    });
    socket.on('newIssue', function (data) {
        console.log(JSON.stringify(socket.handshake.user));
        console.log('received:');
        console.log(data);
        var newIssueData = querystring.parse(data.data);


        console.log(newIssueData);
//        var issue = new Issue(newIssueData);
//        issue.save(function(err){
//           console.log('saving');
//           if(err)
//            console.log(err);
//        });

    });

});

if (conf.get("deployenv") === "heroku") {

    console.log("updating socket.io config for heroku");
    io.configure(function () {
        io.set("transports", ["xhr-polling"]);
        io.set("polling duration", 10);
    });
}

console.log("test conf var: " + conf.get("testvar"));
logger.debug("ampq host: " + conf.get("evtbusamqp_host"));
logger.debug("ampq port: " + conf.get("evtbusamqp_port"));
logger.debug("ampq login: " + conf.get("evtbusamqp_login"));
logger.debug("ampq vhost: " + conf.get("evtbusamqp_vhost"));
//logger.debug("ampq host: " + conf.get("evtbusamqp:host"));

