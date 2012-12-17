
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
    ;


// connect to db
mongoose.connect("mongodb://mxuser:mxusertest@linus.mongohq.com:10022/mxdemo");

//todo: move schema defs to another file
var userSchema = new Schema({
    firstName: String,
    lastName: String,
    email: String,
    password: String
});
mongoose.model('User',userSchema);
var User = mongoose.model('User');

var issueSchema = new Schema({
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
  app.use(express.cookieParser('your secret here'));
  app.use(express.session());
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
app.get('/', ensureAuthenticated,routes.index);
app.get('/demoweb',ensureAuthenticated, demoweb.index);
app.get('/profile', ensureAuthenticated,demoweb.profile);
app.get('/artist',ensureAuthenticated, demoweb.artist);
app.get('/login', demoweb.login);
app.post('/login',
    passport.authenticate('local', { successRedirect: '/demoweb',
                                       failureRedirect: '/login',
                                       failureFlash: true })
);
app.get('/users', user.list);
app.get('/api/issues',function(req,res){
    return Issue.find(function(err,issues){
        if(!err) {
            return res.send(issues);
        } else {
            return console.log(err);
        }
    });
});


passport.use(new LocalStrategy(
    function(username,password,done) {
        if (username == 'sscry' || password == "sscry")
        return done(null,{id:1,"username":username});

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

io.sockets.on('connection',function(socket){

    socket.on('newIssue',function(data){
       console.log('received:');
       console.log(data);
       var newIssueData = querystring.parse(data.data);


       console.log(newIssueData);
        var issue = new Issue(newIssueData);
        issue.save(function(err){
           console.log('saving');
           if(err)
            console.log(err);
        });

    });

});

// send message to domain

domain.domain.handle({id:"1234",command:"createUser",payload:{id:"1234"},username:"eko",password:"blah"});

