var domain = require("../domain/domain");
var uuid = require("node-uuid");

describe("Domain",function(){
    describe("createUser",function(){
       domain.initDomain();
       it('should generate a userCreated event',function(done){
           domain.domain.on('event',function(evt){
              console.log("caught event: "+evt.payload);
              done();
           });
           var newId = uuid.v4();
           domain.domain.handle({id:newId,command:"createUser",payload:{id:newId,username:"eko",password:"blah"}});
       });
    });

});