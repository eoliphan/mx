var _ = require('underscore')
  , should = require("should")
  , uuid = require('node-uuid')
  //, User = require('../../repositories/User').User
  ;


module.exports  = function (config) {
  // validate config
  should.exist(config.evtcmdbus);
  this.evtcmdbus = config.evtcmdbus;
  should.exist(this.evtcmdbus.emitCommand);

  return {
    createUser: function (userinfo) {
      var confirmationCode = uuid.v4();


      var cmd = {
        id: uuid.v4(),
        command: 'createUser',
        payload: userinfo

      }
      evtcmdbus.emitCommand(cmd);

    }
  }


}
//UserApplicationService.prototype.createUser = function (userinfo) {
//  var confirmationCode = uuid.v4();
//
//
//  var cmd = {
//    id: uuid.v4(),
//    command: 'createUser',
//    payload: userinfo
//
//  }
//  evtcmdbus.emitCommand(cmd);
//
//
//}

