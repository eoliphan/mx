/* jshint node:true */
"use strict";

var base = require('cqrs-domain').aggregateBase;
var _ = require('underscore');

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
  addInvestorInfo: function (data, callback) {
    this.apply(this.toEvent('investorInfoAdded', data));

    this.checkBusinessRules(callback);
  },
  updateUser: function (data, callback) {
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
    var info = _.keys(data);
    var self = this;
    _.each(info, function (key, iterator, list) {
      self.set(key, data[key]);
    });
    //this.set(data);
  },
  userUpdated: function (data) {
    var info = _.keys(data);
    var self = this;
    _.each(info, function (key, iterator, list) {
      self.set(key, data[key]);
    });
  }

});