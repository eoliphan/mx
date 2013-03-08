var base = require('cqrs-domain').aggregateBase;

module.exports = base.extend({

    // Commands

    createChipWager: function(data, callback) {
        //console.log('creating user');
        this.apply(this.toEvent('chipWagerCreated', data));

        this.checkBusinessRules(callback);
    },

    destroyChipWager: function(data, callback) {
        this.apply(this.toEvent('chipWagerDestroyed', data));

        this.checkBusinessRules(callback);
    },
    updateChipWagerChips:function(data,callback) {
        this.apply(this.toEvent('chipWagerChipsUpdated', data));

        this.checkBusinessRules(callback);
    },


    // Events

    chipWagerCreated: function(data) {
        //console.log('setting user create data');
        this.set(data);
    },

    chipWagerDestroyed: function(data) {
        this.set('destroyed', true);
    },

    chipWagerChipsUpdated: function(data) {
        //todo: update

        this.set(data);
    }

});