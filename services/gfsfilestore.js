var gridfs = require("gridfs-stream")
  , fs = require("fs")
  , path = require("path")
  , assert = require("assert")
  , async = require('async')
  , conf = require('nconf')
  , mongosetup = require("../util/mongosetup")
  , logger = require('winston')
  ;


exports.store = function (file, type, id, cb) {
  var gfs = mongosetup.gfs();
  var gfsWs = gfs.createWriteStream({
    filename: id,
    contentType: type,
    metadata: {
      test: "meta"
    }
  });
  fs.createReadStream(file)
    .pipe(gfsWs)
    .on('close', function () {
      logger.debug("File: " + id + " written to gfs");
      cb();
    });

}

exports.deleteByName = function (name, cb) {
  var gfs = mongosetup.gfs();
  gfs.remove(options, function (err) {
    cb();
  });


}

exports.getStreamByName = function (name) {
  var gfs = mongosetup.gfs();
  try {
    var readstream = gfs.createReadStream({
      filename: name
    });
  } catch (err) {
    logger.error("Error getting file: " + err);
    return null;
  }

  return readstream;

}

exports.getIds = function (file) {

}