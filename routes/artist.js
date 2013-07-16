/* jslint node: true */
"use strict";

var Order = require("../repositories/order").Order,
  Artist = require("../repositories/artist").Artist,
  mongoose = require('mongoose'),
  logger = require("winston"),
  _ = require('underscore'),
  uuid = require('node-uuid'),
  evtcmdbus = require('../evtcmdbus'),
  async = require("async");

module.exports = function (app) {
  app.get('/api/artist/basicinfo', function (req, res) {
    //logger.debug("works!!!!");
    if (!req.user || !req.user._id) {
      return res.send({});
    }
    // todo add limit of fields
    Artist.findOne({userId: req.user._id}, '_id artistName bio',function (err, artist) {
      if (err) {
        return res.send(400);
      }
      if (artist === null) {
        return res.send({});
      }
      else {
        return res.send(artist);
      }
    });
  });
  app.get('/api/artist/:id', function (req, res) {

    var artistId = req.params.id;
    // todo add limit of fields
    Artist.findOne({_id: artistId}, function (err, artist) {
      if (err) {
        return res.send(400);
      }
      if (artist === null) {
        return res.send({});
      }
      else {
        return res.send(artist);
      }
    });
  });
  app.get('/artist/:id',function(req,res){
    res.render('app');
  });
  app.put('/api/artist/basicinfo', function (req, res) {
    var newArtist = req.body;
    newArtist.userId = req.user._id;
    newArtist.sessionId = req.session.id;
    // need to sent event via cqrs
    logger.debug("new Artist Info" + JSON.stringify(newArtist));
    var cmd = {
      id: uuid.v4(),
      command: 'createArtist',
      payload: newArtist

    };
    evtcmdbus.emitCommand(cmd);
    res.send(200);
  });


};

