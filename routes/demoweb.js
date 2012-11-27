
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