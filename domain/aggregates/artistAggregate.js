var base = require('cqrs-domain').aggregateBase;

module.exports = base.extend({

    // Commands

    createArtist: function(data, callback) {
        //console.log('creating user');
        this.apply(this.toEvent('artistCreated', data));

        this.checkBusinessRules(callback);
    },

    deleteOrder: function(data, callback) {
        this.apply(this.toEvent('artistDeleted', data));

        this.checkBusinessRules(callback);
    },
    addAlbum: function(data, callback) {
        this.apply(this.toEvent('albumAdded', data));

        this.checkBusinessRules(callback);
    },


    // Events

    artistCreated: function(data) {
        //console.log('setting user create data');
        this.set(data);
    },

    artistDeleted: function(data) {
        this.set('destroyed', true);
    },
    albumAdded: function(data) {
        //this.set('destroyed',false);
        var albums =  this.get('albums');
        if (!albums) {
            albums = [];
            this.set('albums',albums);
        }
        albums.push(data);

    }


});