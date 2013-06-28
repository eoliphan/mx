var domain = require("../../domain/domain");
var uuid=require("node-uuid");
//var app = require("../../app");
//module.exports = {
//    setUp: function (callback) {
//        console.log("setting up");
//        domain.initDomain(callback);
//        callback();
//    },
//    tearDown: function (callback) {
//        // clean up
//        console.log('tearing down...');
//        //domain.killDomain();
//        callback();
//    },
//    testCreateUser: function (test) {
//
//        console.log("running test");
//
//        var newId = uuid.v4();
//        domain.domain.on('event',function(evt){
//            console.log("caught event");
//           test.ok(true,'event was transmitted');
//        });
//
//        domain.domain.handle({id:newId,command:"createUser",payload:{id:newId,username:"eko",password:"blah"}});
//
//
//        test.expect(1);
//        test.done();
//    }
//};