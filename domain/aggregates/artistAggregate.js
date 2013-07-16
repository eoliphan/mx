/* jshint node:true */
"use strict";

var base = require('cqrs-domain').aggregateBase
  , _ = require('underscore');

module.exports = base.extend({

  // Commands

  createArtist: function (data, callback) {
    //console.log('creating user');
    this.apply(this.toEvent('artistCreated', data));

    this.checkBusinessRules(callback);
  },

  deleteOrder: function (data, callback) {
    this.apply(this.toEvent('artistDeleted', data));

    this.checkBusinessRules(callback);
  },
  addAlbum: function (data, callback) {
    this.apply(this.toEvent('albumAdded', data));

    this.checkBusinessRules(callback);
  },
  updateAlbum: function (data, callback) {
    this.apply(this.toEvent('albumUpdated', data));

    this.checkBusinessRules(callback);
  },
  addSongToAlbum: function (data, callback) {
    this.apply(this.toEvent('songAddedToAlbum', data));

    this.checkBusinessRules(callback);
  },
  updateSong: function (data, callback) {
    this.apply(this.toEvent('songUpdated', data));

    this.checkBusinessRules(callback);
  },


  // Events

  artistCreated: function (data) {
    //console.log('setting user create data');
    this.set(data);
  },

  artistDeleted: function (data) {
    this.set('destroyed', true);
  },
  albumAdded: function (data) {
    //this.set('destroyed',false);
    var albums = this.get('albums');
    if (!albums) {
      albums = [];
      this.set('albums', albums);
    }
    albums.push(data);

  },
  albumUpdated: function (data) {
    //this.set('destroyed',false);
    var albums = this.get('albums');
    // clone so we can clean
    // todo this is messy
    var newData = _.clone(data);
    // clean the item id
    newData.id = newData.itemId;
    delete newData.itemId;
    if (!albums) {
      albums = [];
      this.set('albums', albums);

    }
    // find the album and update
    var albumToUpdate = _.find(albums, function (album) {
      return newData.id === album.id;
    });

    if (!albumToUpdate) {
      albumToUpdate = {};
      albums.push(albumToUpdate);
    }
    // todo: how to ignore id.
    _.extend(albumToUpdate, newData);
    this.set('albums', albums);

  }, // todo:  this is buggy as hell, used key value or something
  songAddedToAlbum: function (data) {
//    var albums = this.get('albums');
//    // clone so we can clean
//    // todo this is messy
//    var newData = _.clone(data);
//    // clean the item id
//    newData.id = newData.itemId;
//    delete newData.itemId;
//    if (!albums) {
//      albums = [];
//      this.set('albums', albums);
//    }
//    var albumToUpdate = _.find(albums, function (album) {
//      return newData.id === album.id;
//    });
//    albumToUpdate.songs.push( newData);
  },
  songUpdated:function(data){
    // todo for now just update the read model
//    var albums = this.get(albums);
//    var song = _.find(albums.songs,function(song){return song.itemId === data.itemId});
//    if (!song) {
//      song = {itemId: data.itemId}l
//      a
//    }
//    var newData = _.clone(data);
//    delete newData.itemId;
//    _.extend(song,newData);



  }


});