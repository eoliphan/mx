var base = require('cqrs-domain').aggregateBase;

module.exports = base.extend({

    // Commands

    createOffer: function(data, callback) {
        //console.log('creating user');
        this.apply(this.toEvent('offerCreated', data));

        this.checkBusinessRules(callback);
    },

    deleteOffer: function(data, callback) {
        this.apply(this.toEvent('offerDeleted', data));

        this.checkBusinessRules(callback);
    },
    addInvestmentToOffer: function(data, callback) {
        this.apply(this.toEvent('investmentAddedToOffer', data));

        this.checkBusinessRules(callback);
    },


    // Events

    offerCreated: function(data) {
        //console.log('setting user create data');
        this.set(data);
    },

    offerDeleted: function(data) {
        this.set('destroyed', true);
    },
    investmentAddedToOffer: function(data) {
        var investments =  this.get('investments');
        if (!investments) {
            investments = [];
            this.set('investments',investments);
        }
        investments.push(data);
    }


});