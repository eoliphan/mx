
/*
 * GET home page.
 */

exports.index = function(req, res){
  console.log("in demoweb");
  res.render('demoweb', { title: 'Home' });
};

exports.profile = function(req, res){
  console.log("in demoweb");
  res.render('profile', { title: 'Profile' });
};

exports.login = function(req, res){
  console.log("in demoweb");
  res.render('login', { title: 'Login' });
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

exports.promoterinfo = function(req, res){
  //console.log("in demoweb");
  res.render('promoterinfo', { title: 'Promoter Info' });
};

exports.signup = function(req, res){
  //console.log("in demoweb");
  res.render('signup');
};