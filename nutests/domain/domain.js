var domain = require("../../domain/domain");
var uuid=require("node-uuid");
//var app = require("../../app");
module.exports = {
    setUp: function (callback) {
        console.log("setting up");
        this.foo = 'bar';
        //domain =  ;
        domain.initDomain(callback);
        //callback();
    },
    tearDown: function (callback) {
        // clean up
        console.log('tearing down...');
        domain.killDomain();
        callback();
    },
    test1: function (test) {
        test.expect(1);
        console.log("running test");
        test.equals(this.foo, 'bar');
        var newId = uuid.v4();
        domain.domain.handle({id:newId,command:"createUser",payload:{id:newId},username:"eko",password:"blah"});



        test.done();
    }
};