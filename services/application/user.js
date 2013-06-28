var _ = require('underscore')
  ,should = require("should")
  , uuid = require('node-uuid')
;


exports = UserApplicationService = function(config) {
  // validate config
  should.exist(config.evtcmdbus);
  this.evtcmdbus = config.evtcmdbus;
  should.exist(this.evtcmdbus.emitCommand);



//  /unction create
//  function changePassword(username,newPassword) {
//
//  }

}
UserApplicationService.prototype.create = function (username,password) {
    var cmd = {

    }

  }

