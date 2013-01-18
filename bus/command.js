var redis = require("redis");

var client = redis.createClient("9725","slimehead.redistogo.com");

client.auth("7b8206717498f7a0763079723fcce249",function(){
   console.log("command queue connected to redis");
});

exports.publish = function(){
    client.pu

};
