var mongoose = require('mongoose')
  , gridfs = require('gridfs-stream')
  , conf = require('nconf')
  , tmp = require('tmp')
  , uuid = require('node-uuid')
  , fs = require('fs')
  , logger = require('winston')
  , async = require('async')
  , should = require('should')
  //, streams = require('streamline/lib/streams/server/streams')
  ;

conf.file({file: './confval.json'});
var mongoconf = conf.get("database");
var mongosetup = require('../../util/mongosetup');

tmp.setGracefulCleanup();

var gfsfilestore = require('../../services/gfsfilestore');
logger.debug(gfsfilestore);
describe("gfsfilestore", function () {
  var file;
  var fileData = uuid.v4();
  before(function (done) {
    mongosetup.init(mongoconf, function () {
      done();
    });
  });
  beforeEach(function (done) {
    tmp.file(function (err, path) {
      file = path;
      fs.writeFileSync(path, fileData);
      done();
    });

  });
  describe('store()', function () {
    it('should create a file in the mongo grid file store', function (done) {
      var fileId = uuid.v4();
      async.series([
        function (cb) {
          gfsfilestore.store(file, 'text/plain',fileId ,function () {
            cb();
          });

        },
        function (cb) {
          // delay a bit
          setTimeout(function () {
            var fileStr = gfsfilestore.getStreamByName(fileId);
            //var wrappedStr =  streams.ReadableStream(fileStr);
            fileStr.on('data',function(data){
              //logger.debug("data: " + data);
              data.toString().should.eql(fileData);
            });
            fileStr.on('end',function(){
              //logger.debug("done");
              cb();

            });
          }, 250);


        }
      ], function () {
        done();
      });


    });

  });
});