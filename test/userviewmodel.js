var userviewmodel = require("../viewmodel/user").repo;
var uuid = require("node-uuid");

describe("UserViewModel",function(){
    describe("create new user",function(){
        it('should create with no errors',function(done){
           var vm = userviewmodel.fromObject({
               id: uuid.v4(),
               name: "erich oliphant",
               username: "erich",
               email: "erich.oliphant@gmail.com"
           });
           console.log("vm: "+JSON.stringify(vm));
           vm.commit(done);
            console.log("vm after: "+JSON.stringify(vm));
        });
    });
});