var base = require('cqrs-domain').aggregateBase;

module.exports = base.extend({

    // Commands

    createUser: function(data, callback) {
        //console.log('creating user');
        this.apply(this.toEvent('userCreated', data));

        this.checkBusinessRules(callback);
    },

    destroyUser: function(data, callback) {
        this.apply(this.toEvent('userDestroyed', data));

        this.checkBusinessRules(callback);
    },


    // Events

    userCreated: function(data) {
        //console.log('setting user create data');
        this.set(data);
    },

    userDestroyed: function(data) {
        this.set('destroyed', true);
    }

});