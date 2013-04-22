var commandHandlerBase = require('cqrs-domain').commandHandlerBase;

module.exports = commandHandlerBase.extend({

    aggregate: 'artistAggregate',

    commands: ['createArtist', 'deleteArtist', 'addAlbum', 'updateAlbum' ]

//    fooIt: function(id, cmd) {
//        var self = this;
//        (new this.Command({
//            command: 'createFoo',
//            payload: {
//                name: 'bla'
//            }
//        })).emit(function(evt) {
//            cmd.payload.fooId = evt.payload.id;
//            self.defaultHandle(id, cmd);
//        });
//    }

});