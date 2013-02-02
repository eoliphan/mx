
/**
 * Module dependencies.
 */
require('nodetime').profile({
    accountKey: '0e70635ffc6e0abdd3e4ae80e85fd15a9a4c1749',
    appName: 'Scry Application'
  });
var express = require('express')
  , routes = require('./routes')
  , user = require('./routes/user')
  , demoweb = require('./routes/demoweb')
  , http = require('http')
  , path = require('path')
  , passport = require('passport')
  , mongoose = require('mongoose')
    , Schema = mongoose.Schema
  , LocalStrategy = require('passport-local').Strategy
    ,  querystring = require('querystring')
    , domain = require("./domain/domain")
    , passportSocketIo = require("passport.socketio")
    , uuid = require('node-uuid') 
    , conf = require('./config').conf
    , userrepo = require("./repositories/user")
    , flash = require('connect-flash')
    , User = require("./repositories/user").User
    , Artist = require("./repositories/artist").Artist,
    _ = require('underscore')
    ;





var issueSchema = new Schema({
    userId: String,
    projectName: String,
    amountRequired: Number,
    noOfShares: Number,
    singleInvestorMax: Number,
    description: String,
    photoPath:String

});
mongoose.model("Issue",issueSchema);
var Issue = mongoose.model("Issue");




// - end schema
var app = express();

app.configure('development', function(){
  app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
});

app.configure('production', function(){
  app.use(express.errorHandler());
});
store  = new express.session.MemoryStore;
app.configure(function(){
  app.set('port', process.env.PORT || 3000);
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.set('view options', { pretty: true });
  app.locals.pretty = true;
  app.use(express.favicon());
  app.use(express.logger('dev'));
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(express.cookieParser('secret'));
  app.use(express.session({ secret: 'secret', store: store }));
  app.use(flash());
  app.use(passport.initialize());
  app.use(passport.session());
  app.use(app.router);
  app.use(express.static(path.join(__dirname, 'public')));
});

app.configure('development', function(){
  app.use(express.errorHandler());
});

function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) { return next(); }
  res.redirect('/login')
}

/// -- routes
app.get('/', function(req,res){
    res.redirect("/demoweb");
});
app.get('/demoweb', demoweb.index);
app.get('/profile', ensureAuthenticated,demoweb.profile);
app.get('/profile/detail', ensureAuthenticated,demoweb.profiledetail);
app.get('/artist',ensureAuthenticated, demoweb.artist);
app.get('/logout',function(req,res){
    req.logout();
    res.redirect("/");
});
app.get('/login', demoweb.login);
app.post('/login',
    passport.authenticate('local', { successRedirect: '/demoweb',
                                       failureRedirect: '/login',
                                       failureFlash: true })
);
app.get('/artistinfo', demoweb.artistinfo);
app.get('/signup', demoweb.signup);
app.post('/signup',function(req,res){
    console.log(JSON.stringify(req.body));

    var newUser = new userrepo.User(req.body);
    newUser.save();
    //req.flash('info',"User Created.  Please Log In");
    res.redirect("/login");

});

app.get('/fragments/:frag',ensureAuthenticated,function(req,res){
    User.findById(req.user._id,function(err,user){
          if (err) res.send(400);
          else
            res.render("fragments/"+req.params.frag,{user:user});
      });

});
app.get('/users', user.list);

app.get('/store',demoweb.store);

app.get('/album/:id',function(req,res){
    // grab the album
    var albumId = mongoose.Types.ObjectId(req.params.id);
    console.log(albumId);
    Artist.aggregate(
        {$match: {'albums._id':albumId}},
                    {$project:{
                    'artistName':1,
                    'bio': 1,
                    'albums' : 1
                }},
                {$unwind: "$albums"},

            function(err,artists){
                            if (!err) {
                                //TODO: clunky to have to filter here
                                var match = _.where(artists,{'albums._id':req.params.id});
                                var artist = _.find(artists,function(element){
                                    return (element.albums._id == req.params.id)

                                });
                                res.send(artist);



                            }
                            else
                            {
                                console.log(err);
                                res.send(404);
                            }

                        });

//    Artist.findOne({'albums._id':albumId},"albums",function(err,artist){
//        if(err)
//            res.send(404);
//        else
//            res.send(artist);
//
//    });
});
app.get('/cart',demoweb.cart);
app.get('/about',demoweb.about);

// -- utility
app.get('/util/rndsmlcvr/:rnd',function(req,res){
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
// -- api mappings
app.get('/api/checkemail',function(req,res){
    console.log(req.value);
});

app.get('/api/session/user',ensureAuthenticated,function(req,res){
    userrepo.User.findById(req.user._id,function(err,user){
          if (err) res.send(400);
          var jsonData = JSON.stringify(user);
          res.send(jsonData);
      });
});

app.put('/api/user/:id',function(req,res){
    console.log(req.params.id);
    console.log(req.body);
    var body = req.body;
    delete body._id;
    delete body.email;

    userrepo.User.update({_id:req.params.id},{$set: body},function(err,numAffected,raw){
        if (err)
            res.send(400);
        else
            res.send(200);
    });

});

app.post('/api/issue',function(req,res){
    console.log(req.params.id);
    console.log(req.body);
    var body = req.body;
    body.userId = req.user._id;
    // handle uploaded file
    var tmpPath = req.files.photo.path;
    var newUuid = uuid.v4();
    var tgtPath = '.public/images/issues/'+newUuid;
    body.photoPath = tgtPath;
    fs.rename(tmpPath,tgtPath,function(err){
        if (err) throw err;
        fs.unlink(tmpPath,function(){
            if(err) throw err;

        });
    });
    var issue = new Issue(body);
    issue.save(function(err){
       console.log('saving');
       if(err)
            res.send(400);
       else
            res.redirect("/profile");
    });
//    userrepo.User.update({_id:req.params.id},{$set: body},function(err,numAffected,raw){
//        if (err)
//            res.send(400);
//        else
//            res.send(200);
//
//
//    });

});
app.get('/api/issues',function(req,res){
    return Issue.find(function(err,issues){
        if(!err) {
            return res.send(issues);
        } else {
            return console.log(err);
        }
    });
});

app.get('/api/albums',function(req,res){
//    Artist.find()
//        .limit(50)
//        .select('albums')
//        .exec(function(err,artists){
//            if (!err)
//                 res.send(artists);
//            else
//            {
//                console.log(err);
//                res.send(404);
//            }
//
//        });
    Artist.aggregate({$project:{
                    'artistName':1,
                    'albums' : 1

                }},
                {$unwind: "$albums"},
                {$limit: 50},
            function(err,artists){
                            if (!err)
                                 res.send(artists);
                            else
                            {
                                console.log(err);
                                res.send(404);
                            }

                        });


});
app.get('/api/albums/bygenre/:genre',function(req,res){
    Artist.find({'albums.genre':req.params.genre})
            .limit(50)
            //.where('albums.genre').equals(req.params.genre)
            .select('albums')
            .exec(function(err,artists){
                if (!err)
                     res.send(artists);
                else
                {
                    console.log(err);
                    res.send(404);
                }

            });

});

app.get('/api/songs',function(req,res){
//    Artist.find()
//            .limit(50)
//            .select('albums.songs')
//            .exec(function(err,artists){
//                if (!err)
//                     res.send(artists);
//                else
//                {
//                    console.log(err);
//                    res.send(404);
//                }
//
//            });
    Artist.aggregate({$project:{
                'artistName':1,
                'bio': 1,
                'albums' : 1
            }},
            {$unwind: "$albums"},
            {$limit: 50},
        function(err,artists){
                        if (!err)
                             res.send(artists);
                        else
                        {
                            console.log(err);
                            res.send(404);
                        }

                    });

});

app.get('/api/songs/bygenre/:genre',function(req,res){
    Artist.find()
                .limit(50)
                .select('albums.songs')
                .where('albums.songs.genre').equals(req.params.genre)
                .exec(function(err,artists){
                    if (!err)
                         res.send(artists);
                    else
                    {
                        console.log(err);
                        res.send(404);
                    }

                });
});



passport.use(new LocalStrategy({usernameField:'email'},
    function(username,password,done) {

        userrepo.User.findOne({email: username},function(err,user){
            if(err){return done(err);}
            if(!user) {
                return done(null,false,{message: "Incorrect user."});
            }
            if(!user.password == password) {
                return done(null,false,{message: "Incorrect password"});
            }
            return done(null,user);
        });
//        if (username == 'sscry' || password == "sscry")
//        return done(null,{id:1,"username":username});

    }

));

passport.serializeUser(function(user, done) {
  done(null, user);
});

passport.deserializeUser(function(id, done) {
  //User.findById(id, function(err, user) {
    done(null, id);
  //});
});

var server = http.createServer(app).listen(app.get('port'), function(){
  console.log("Express server listening on port " + app.get('port')
  + ":" + app.get('env'));
});

// setup socket io
var io = require('socket.io').listen(server);
io.set('log level',1);
io.set("authorization", passportSocketIo.authorize({
    sessionKey:    'connect.sid',      //the cookie where express (or connect) stores its session id.
    sessionStore:  store,     //the session store that express uses
    sessionSecret: "secret", //the session secret to parse the cookie
    fail: function(data, accept) {     // *optional* callbacks on success or fail
      accept(null, false);             // second param takes boolean on whether or not to allow handshake
    },
    success: function(data, accept) {
      accept(null, true);
    }
  }));

io.sockets.on('connection',function(socket){
    socket.on('message',function(data){
        console.log('received generic:');
               console.log(data);
               var newIssueData = querystring.parse(data.data);


               console.log(newIssueData);

    });
    socket.on('command',function(data){
           console.log('received command:');
           console.log(data);
           var commandData = querystring.parse(data.data);
           var newUuid = uuid.v4();
           console.log(commandData);
           domain.domain.handle({id:newUuid,command:data.command,payload:commandData});


    });
    socket.on('createUser',function(data){
        console.log('received:');
       console.log(data);
       var newIssueData = querystring.parse(data.data);


       console.log(newIssueData);

    });
    socket.on('newIssue',function(data){
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

// init domain
domain.initDomain();
// send message to domain

domain.domain.on('event',function(evt){
   console.log('event: ' + JSON.stringify(evt));
});
//for (var i = 0; i < 10;i++){
//    var newUuid = uuid.v4();
//    var objId = uuid.v4();
//    //domain.domain.handle({id:newUuid,command:"createUser",payload:{id:objId,email:"e@e.com",password:"blah"}});
//    domain.domain.handle({id:newUuid,command:"changeUserPassword",payload:{id:"c586c0ee-b7a3-482f-85a4-3d585209d729",email:"e@e.com",password:objId}});
//}
