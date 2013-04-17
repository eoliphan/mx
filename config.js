var conf = require('nconf');

//conf.env('_');
conf.argv().env('_').file({file:"./confval.js"});
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
conf.set("evtbusamqp:host","tiger.cloudamqp.com");
conf.set("evtbusamqp:port","5672");
conf.set("evtbusamqp:login","gttbyzfy");
conf.set("evtbusamqp:password","s5etXP7ROddzMvncxZU5-LW29KRJlyWZ");
conf.set("evtbusamqp:vhost","gttbyzfy");

conf.set("testvar","local");

conf.set("deployenv","local");


console.log('database: ' + conf.get('database'));
exports.conf=conf;
