var conf = require('nconf');

conf.argv().env().file({file:"./confval.js"});
conf.set("database:host","linus.mongohq.com");
conf.set("database:port",10022);
conf.set("database:name","mxdemo");
conf.set("database:user","mxuser");
conf.set("database:password","mxusertest");

console.log('database: ' + conf.get('database'));
exports.conf=conf;
