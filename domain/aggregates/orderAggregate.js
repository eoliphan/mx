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
    assignUserToOrder:function(data,callback){
        this.apply(this.toEvent('userAssignedToOrder', data));

        this.checkBusinessRules(callback);
    },
    buyOrder:function(data,callback){
        this.apply(this.toEvent('orderBought', data));

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
        var items =  this.get('items');
        if (!items) {
            items = [];
            this.set('items',items);
        }
        items.push(data);
        //this.set(data);
    },
    orderStatusChangedToOrder:function(data) {
        //this.set(data);
    },
    userAssignedToOrder:function(data) {
        this.set('userId',data.userId);
    },
    orderBought:function(data){
        this.set('type','order');
        this.set(data);
    }


});