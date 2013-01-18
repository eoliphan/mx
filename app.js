
/**
 * Module dependencies.
 */

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
    , flash = require('connect-flash');





var issueSchema = new Schema({
    userId: String,
    projectName: String,
    amountRequired: Number,
    noOfShares: Number,
    singleInvestorMax: Number,
    description: String

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
app.get('/users', user.list);
app.get('/api/checkemail',function(req,res){
    console.log(req.value);
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
