var mongoose = require('mongoose')
  , gridfs = require('gridfs-stream')
  , logger = require('winston')


var gfs;

exports.init = function (conf,done) {
  var connstring = "mongodb://" + conf.user + ":" + conf.password + "@" +
    conf.host + ":" + conf.port + "/" + conf.name;
  //todo mask pw
  logger.info("Mongo connection string: " + connstring);
  var conn = mongoose.connect(connstring);

  mongoose.connection.once("open", function (conn) {
    gfs = gridfs(mongoose.connection.db, mongoose.mongo);
    logger.info("Mongo initialized");
    if (done)
      done();

  });


}
exports.gfs = function(){ return gfs; }
exports.mongo = function(){return mongoose.mongo;}