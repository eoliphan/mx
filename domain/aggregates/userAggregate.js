var base = require('cqrs-domain').aggregateBase;

module.exports = base.extend({

    // Commands

    createUser: function(data, callback) {
        this.apply(this.toEvent('userCreated', data));

        this.checkBusinessRules(callback);
    },

    destroyUser: function(data, callback) {
        this.apply(this.toEvent('userDestroyed', data));

        this.checkBusinessRules(callback);
    },


    // Events

    userCreated: function(data) {
        this.set(data);
    },

    userDestroyed: function(data) {
        this.set('destroyed', true);
    }

});