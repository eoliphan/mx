
/*
 * GET home page.
 */

exports.index = function(req, res){
    console.log('in index route')
  res.render('index', { title: 'Express' });
};