var base = require('cqrs-domain').aggregateBase;

module.exports = base.extend({

    // Commands

    createOrder: function(data, callback) {
        //console.log('creating user');
        this.apply(this.toEvent('orderCreated', data));

        this.checkBusinessRules(callback);
    },

    deleteOrder: function(data, callback) {
        this.apply(this.toEvent('orderDeleted', data));

        this.checkBusinessRules(callback);
    },
    addItemToOrder:function(data,callback) {
        this.apply(this.toEvent('itemAddedToOrder', data));

        this.checkBusinessRules(callback);
    },
    changeOrderStatusToOrder:function(data,callback) {
        this.apply(this.toEvent('orderStatusChangedToOrder', data));

        this.checkBusinessRules(callback);
    },


    // Events

    orderCreated: function(data) {
        //console.log('setting user create data');
        this.set(data);
    },

    orderDeleted: function(data) {
        this.set('destroyed', true);
    },

    itemAddedToOrder: function(data) {
        this.set(data);
    },
    orderStatusChangedToOrder:function(data) {
        //this.set(data);
    }

});