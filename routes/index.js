/**
 * @module routes/index
 *
 * main routes
 * @param app
 * @returns {{partials: Function}}
 */
var User = require('../repositories/user').User
    , passport = require('passport')
    , logger = require('../logger')
    , awsfilestore = require('../services/awsfilestore')
    , uuid = require("node-uuid")
    , evtcmdbus = require('../evtcmdbus')

    ;

;

ensureAuthenticated = function (req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    } else {
        res.send(401);
    }

};

module.exports = function (app) {

    require("./artist")(app);
    require("./offer")(app);
    require("./order")(app);
    require("./wager")(app);
    require("./album")(app);

    app.get("/faq", function (req, res) {
        res.render('faq', {title: "FAQ"});
    });


    app.get('/signup', demoweb.signup);
    /**
     * @todo refactor to command
     */
    app.post('/api/signup', function (req, res) {
        logger.debug(JSON.stringify(req.body));
        var confirmationCode = uuid.v4();
        User.register(new User({ email: req.body.email, confirmationCode: confirmationCode }),
            req.body.password, function (err, account) {
            if (err) {
                logger.error("Error creating account: " + err);
                return res.send(400,{message:"Error creating account"});
            }
            res.send(200);
            //res.redirect('/');
        });
        //var newUser = new userrepo.User(req.body);
        //newUser.save();
//        req.flash('info', "Account Created. Welcome to SoundSrcy.  Please Log In");
//        res.redirect("/login");

    });
    app.get('/logout', function (req, res) {
        req.logout();
        res.redirect("/");
    });
    app.get('/login', demoweb.login);
    app.post('/login',
        passport.authenticate('local', { successRedirect: '/demoweb',
            failureRedirect: '/login',
            failureFlash: true })
    );
    function cleanUser(user) {
        delete user.salt;
        delete user.hash;
        delete user.password;
        return user;

    }

    app.post('/api/auth', passport.authenticate('local'), function (req, res) {

        var user = cleanUser(req.user);
        res.send(user);

    });
    app.get('/api/auth', ensureAuthenticated, function (req, res) {
        res.send(cleanUser(req.user));
    });
    app.delete('/api/auth',  function (req, res) {
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
    app.post('/trackupl',function(req,res){

    });
    app.post('/uploads', function (req, res) {
        awsfilestore.store(req.files.image.path, uuid.v4(), function (err, url) {

            var command = {
                command: req.body.command,
                id: uuid.v4(),
                payload: {
                    itemId: req.body.itemId,
                    sessionId: req.session.id,
                    img:url
                }
            }
            evtcmdbus.emitCommand(command);
            //console.log(command);
        });
        res.send(200);

    });

}
