var conf = require('nconf');

conf.argv().env().file({file:"./confval.js"});
//-- mongo
conf.set("database:host","linus.mongohq.com");
conf.set("database:port",10022);
conf.set("database:name","mxdemo");
conf.set("database:user","mxuser");
conf.set("database:password","mxusertest");

//-- redis
conf.set("redis:host","slimehead.redistogo.com");
conf.set("redis:port",9725);
conf.set("redis:pass","7b8206717498f7a0763079723fcce249");

// rabbit mq

console.log('database: ' + conf.get('database'));
exports.conf=conf;
