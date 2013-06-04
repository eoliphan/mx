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

var artist = require('../../eventhandlers/artist');

describe('artist event handler',function(){
  describe('songUpdated',function(){
    it('should add an element to a song',function(done){
      //todo refactor for independence for now use existing
      var event = {
        itemId:"7a0a9ea7-9e03-459e-a31d-14963482c88f",
        mediaId: uuid.v4(),
        mediaIdType:'gridfs',
        origFileName:uuid.v4()
      }
      artist.songUpdated(event);
      setTimeout(function(){
        done();
      },1000)

    });
  });
});

