var conf = require('nconf'),
  uuid = require('node-uuid'),
  should = require('should')

  ;

conf.set("domainType", "inMemory");

var domain = require("../../domain/domain");
var UserAggregate = require("../../domain/aggregates/userAggregate");

describe('userAggregate', function () {
  beforeEach(function (done) {
    domain.domain.removeAllListeners('event');
    domain.initDomain({"domainType": "inMemory"}, function () {
      done();
    })
  });
  describe('creating a new user', function () {
    it('should generate a user created event', function (done) {
      var userId = uuid.v4();
      var email = "test@email.com";
      var password = "1234";
      domain.domain.on('event', function (evt) {
        evt.payload.id.should.equal(userId);
        evt.payload.email.should.equal(email);
        evt.payload.password.should.equal(password);
        done();
      });

      var cmd = {
        command: 'createUser',
        id: userId,
        payload: {
          id: userId,
          email: email,
          password: password
        }
      };
      domain.domain.handle(cmd);
    });

  })

  describe("a change of password", function () {

    it('should version a user', function (done) {
      var userId = uuid.v4(),
        email = "test@email.com",
        password1 = "1234",
        password2 = "5678",
        created = false,
        pwchanged = false;

      function process(evt) {
        //console.log("Event: " + JSON.stringify(evt,null,2));
        //console.log("created: " + created +", pwchanged: " + pwchanged);
        if (created && pwchanged) {
          return;
        }
        if (evt.event === 'userCreated') {
          created = true
        }
        if (evt.event === "userPasswordChanged") {
          pwchanged = true;
        }
        if (created && pwchanged) {
          evt.head.revision.should.equal(2);
          evt.payload.password.should.equal(password2);
          done();

        }
      }

      domain.domain.on('event', function (evt) {
        process(evt);
      });

      var cmd = {
        command: 'createUser',
        id: userId,
        payload: {
          id: userId,
          email: email,
          password: password1
        }
      };
      domain.domain.handle(cmd);
      var cmd = {
        command: 'changeUserPassword',
        id: userId,
        payload: {
          id: userId,
          password: password2
        }
      };
      domain.domain.handle(cmd);

    });

  });

});