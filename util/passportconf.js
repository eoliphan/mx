/**
 * @module passportcong
 * Setup for passport authentication
 * @type {*}
 */

var passport = require('passport')
    , User = require('../repositories/user').User
    , logger= require('../logger')

    ;

passport.use(User.createStrategy());

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

/*passport.use(new LocalStrategy({usernameField: 'email'},
    function (username, password, done) {

        User.findOne({email: username}, function (err, user) {
            if (err) {
                return done(err);
            }
            if (!user) {
                return done(null, false, {message: "Incorrect user."});
            }
            if (!user.password == password) {
                return done(null, false, {message: "Incorrect password"});
            }
            return done(null, user);
        });
//        if (username == 'sscry' || password == "sscry")
//        return done(null,{id:1,"username":username});

    }

));

passport.serializeUser(function (user, done) {
    done(null, user);
});

passport.deserializeUser(function (id, done) {
    //User.findById(id, function(err, user) {
    done(null, id);
    //});
});*/
