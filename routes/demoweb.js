var User = require("../repositories/user").User;
/*
 * GET home page.
 */

exports.index = function(req, res){
  console.log("in demoweb");
  //res.render('demoweb', { title: 'Home' });
    if (req.user) {
    var curUser = User.findById(req.user._id,function(err,user){
          if (err) res.send(400);
          res.render('demoweb',{title: 'Home',user:user});
      });
    }
    else
        res.render('demoweb', { title: 'Home' });
};

exports.profile = function(req, res){
  console.log("in demoweb");
    User.findById(req.user._id,function(err,user){
          if (err) res.send(400);
          res.render('profile',{title: 'Profile',user:user});
      });

};

exports.login = function(req, res){
  console.log("in demoweb");
  res.render('login', { title: 'Login', alert: req.flash('info')[0] });
};

exports.artist = function(req, res){
  console.log("in demoweb");
  res.render('artist', { title: 'Artist' });
};

exports.artistinfo = function(req, res){
  //console.log("in demoweb");
  res.render('artistinfo', { title: 'Artist Info' });
};

exports.musicloverinfo = function(req, res){
  //console.log("in demoweb");
  res.render('musicloverinfo', { title: 'Music Lover Info' });
};

exports.investorinfo = function(req, res){
  //console.log("in demoweb");
  res.render('promoterinfo', { title: 'Investor Info' });
};

exports.signup = function(req, res){
  //console.log("in demoweb");
  res.render('signup',{title: ''});
  //res.render();
};

exports.profiledetail = function(req, res){
  //console.log("in demoweb");
  User.findById(req.user._id,function(err,user){
      if (err) res.send(400);
      res.render('profiledetail',{title: 'Profile Detail',user:user});
  });

};

exports.store = function(req, res){
  //console.log("in demoweb");
  res.render('store',{title: 'SoundScry Store'});
  //res.render();
};

exports.cart = function(req, res){
  //console.log("in demoweb");
  res.render('cart',{title: 'SoundScry Store'});
  //res.render();
};

exports.about = function(req, res){
  //console.log("in demoweb");
  res.render('about',{title: 'About SoundScry'});
  //res.render();
};

exports.contact = function(req, res){
  //console.log("in demoweb");
  res.render('contact',{title: 'Contact'});
  //res.render();
};