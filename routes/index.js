/* jshint node:true */
"use strict";
/**
 * @module routes/index
 *
 * main routes
 * @param app
 * @returns {{partials: Function}}
 */
var //User = require('../repositories/user').User
  passport = require('passport')
  , logger = require('../logger')
  , awsfilestore = require('../services/awsfilestore')
  , uuid = require("node-uuid")
  , evtcmdbus = require('../evtcmdbus')
  , gfsfilestore = require('../services/gfsfilestore')
  , userService = require('../services/application/user')({evtcmdbus: evtcmdbus})
  , _ = require('underscore')

  ;

//var userService = new UserService({evtcmdbus:evtcmdbus});

var ensureAuthenticated = function (req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  } else {
    res.send(401);
  }

};

var testAuth = function (req, res, next) {

  "use strict";
  var func = passport.authenticate('local');

  return func;

}

module.exports = function (app) {
  "use strict";
  require("./artist")(app);
  require("./offer")(app);
  require("./order")(app);
  require("./wager")(app);
  require("./album")(app);

  app.get("/faq", function (req, res) {
    res.render('app');
  });


  //app.get('/signup', demoweb.signup);
  /**
   * @todo refactor to command
   */
  app.post('/api/signup', function (req, res) {
    logger.debug(JSON.stringify(req.body));
    var userInfo = req.body;
    userService.createUser(userInfo);

  });
  app.get('/logout', function (req, res) {
    req.logout();
    res.redirect("/");
  });
  //app.get('/login', demoweb.login);
  app.post('/login',
    passport.authenticate('local', { successRedirect: '/demoweb',
      failureRedirect: '/login',
      failureFlash: true })
  );
  function cleanUser(user) {
    delete user.salt;
    delete user.hash;
    delete user.password;
    var tmpuser = user.toObject();
    return _.omit(tmpuser, ['password', 'salt', 'hash', 'confirmationCode']);

  }

  app.post('/api/auth', passport.authenticate('local'), function (req, res) {

    var user = cleanUser(req.user);
    res.send(user);

  });
  app.get('/api/auth', ensureAuthenticated, function (req, res) {
    res.send(cleanUser(req.user));
  });
  app.delete('/api/auth', function (req, res) {
    req.logout();

    res.send(200);

  });
  app.get('/partials/:name', function (req, res) {
    var name = req.params.name;
    res.render('partials/' + name);
  });
  app.get('/', function (req, res) {
    res.render('app');
  });
  app.post('/trackupl', function (req, res) {

  });
  app.post('/uploads', function (req, res) {
    awsfilestore.store(req.files.image.path, uuid.v4(), req.files.image.headers['content-type'], function (err, url) {

      var command = {
        command: "updateAlbum",
        id: uuid.v4(),
        payload: {
          itemId: req.body.itemId,
          sessionId: req.session.id,
          img: url
        }
      };
      evtcmdbus.emitCommand(command);
      //console.log(command);
    });
    res.send(200);

  });
  app.post('/fileuploads', function (req, res) {
    var fileId = uuid.v4();
    gfsfilestore.store(req.files.file.path, req.files.file.type, fileId, function () {
      var command = {
        command: 'updateSong',
        id: uuid.v4(),
        payload: {
          itemId: req.body.itemId,
          //id: req.body.albumId,
          mediaId: fileId,
          mediaIdType: 'gridfs',
          origFileName: req.body.origFileName,
          sessionId: req.session.id

        }
      };
      evtcmdbus.emitCommand(command);
      res.send(200);
    });


  });
  app.post('/api/investor', function (req, res) {
    var info = _.pick(req.body, ['firstName', 'lastName', 'address', 'city', 'state', 'zip', 'investorClass']);
    info.isInvestor = true;
    info.isInvestorPending = false;
    info.id = req.body._id;
    info.sessionId = req.session.id;
    // strip out stuff we dont need
    var command = {
      id: uuid.v4(),
      command: "addInvestorInfo",
      payload: info
    };

    evtcmdbus.emitCommand(command);
    res.send(200);


  });
  app.post('/api/artist', function (req, res) {

    var user = _.pick(req.body.curUser, ['firstName', 'lastName', 'address', 'city', 'state', 'zip']);
    user.isArtist = true;
    user.isArtistPending = false;
    user.id = req.body.curUser._id;
    user.sessionId = req.session.id;
    // strip out stuff we dont need
    var command = {
      id: uuid.v4(),
      command: "updateUser",
      payload: user
    };

    evtcmdbus.emitCommand(command);
    var artistInfo = req.body.curArtist;
    artistInfo.sessionId = req.session.id;
    artistInfo.userId = req.body.curUser._id;
    var artistCommand = {
      id:uuid.v4(),
      command: "createArtist",
      payload:artistInfo
    };
    evtcmdbus.emitCommand(artistCommand);
    res.send(200);

  });
};
