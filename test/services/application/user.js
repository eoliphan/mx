var UserApplicationService = require("../../../services/application/user");
var  domain = require("../../../domain/domain");

//
describe('user application service', function () {
  beforeEach(function (done) {
    domain.domain.removeAllListeners('event');
    domain.initDomain({"domainType": "inMemory"}, function () {
      done();
    })
  });
  it('should create a user created event', function (done) {
    var evtcmdbus = {
      emitCommand:function(command){
        //domain.domain.handle(command);
      }
    }
    var uas = new UserApplicationService({evtcmdbus:evtcmdbus});



  })
})