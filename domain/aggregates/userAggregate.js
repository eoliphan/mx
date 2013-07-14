var base = require('cqrs-domain').aggregateBase;

module.exports = base.extend({

  // Commands

  createUser: function (data, callback) {
    //console.log('creating user');
    this.apply(this.toEvent('userCreated', data));

    this.checkBusinessRules(callback);
  },

  destroyUser: function (data, callback) {
    this.apply(this.toEvent('userDestroyed', data));

    this.checkBusinessRules(callback);
  },
  changeUserPassword: function (data, callback) {
    this.apply(this.toEvent('userPasswordChanged', data));

    this.checkBusinessRules(callback);
  },
  addUserWager: function (data, callback) {
    this.apply(this.toEvent('userWagerAdded', data));

    this.checkBusinessRules(callback);
  },
  addInvestorInfo: function (data, callbacl) {
    this.apply(this.toEvent('investorInfoAdded', data));

    this.checkBusinessRules(callback);
  },
  updateUser: function (data, callbacl) {
    this.apply(this.toEvent('userUpdated', data));

    this.checkBusinessRules(callback);
  },


  // Events

  userCreated: function (data) {
    //console.log('setting user create data');
    this.set(data);
  },

  userDestroyed: function (data) {
    this.set('destroyed', true);
  },

  userPasswordChanged: function (data) {
    this.set('password', data.password);
  },
  investorInfoAdded: function (data) {
    //this.set(data);
  },
  userUpdated: function (data) {
    //this.set(data);
  }

});