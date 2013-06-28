var domain = require('cqrs-domain').domain;
  //conf = require('nconf');
exports.domain = domain;
//mongo linus.mongohq.com:10022/mxdemo -u <user> -p<password>


exports.killDomain = function() {

    domain=null;
    //process.kill(pid);

};
exports.initDomain = function(conf,callback) {
  var dbHost=conf.dbHost;
  var dbPort=conf.dbPort;
  var db_name=conf.db_name;
  var dbUser=conf.dbUser;
  var dbPass=conf.dbPass;
  var domainType=conf.domainType;

    domain.initialize({
        commandHandlersPath: __dirname + '/commandHandlers',
        aggregatesPath: __dirname + '/aggregates',
        sagaHandlersPath: __dirname + '/sagaHandlers',  // optional, only if using sagas
        sagasPath: __dirname + '/sagas',                // optional, only if using sagas
        publishingInterval: 20,                         // optional
        snapshotThreshold: 10,
        forkEventDispatching: false,                          // optional
        commandQueue: {                                 // optional
            type: domainType,                            // example with mongoDb
            dbName: db_name,
            collectionName: 'commands',                 // optional
            host: dbHost,                          // optional
            port: dbPort,                                // optional
            username: dbUser,                           // optional
            password: dbPass                             // optional
        },
        repository: {                                   // optional
            type: domainType,                            // example with mongoDb
            dbName: db_name,
            collectionName: 'sagas',                    // optional
            host: dbHost,                          // optional
            port: dbPort,                                // optional
            username: dbUser,                           // optional
            password: dbPass                             // optional
        },
//        eventStore: {
//                type: 'inMemory', //'mongoDb',
//                dbName: 'cqrssample'
//            }
        eventStore: {                                   // optional
            type: domainType,                            // example with mongoDb
            dbName: db_name,
            eventsCollectionName: 'events',             // optional
            snapshotsCollectionName: 'snapshots',       // optional
            host: dbHost,                          // optional
            port: dbPort,                                // optional
            username: dbUser,                           // optional
            password: dbPass                               // optional
        }
    }, function(err) {
        console.log("loaded domain...");
        console.log("domain: "+ domain);
//        var pid = domain.es.dispatcher.pid;
//                process.on('exit',function(){
//                   process.kill(pid);
//                });
        if(err)
            console.log("error detected: " + err);

        if(callback)
            callback();

    });

};