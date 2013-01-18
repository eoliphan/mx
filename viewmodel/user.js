var repo = require('viewmodel').write;
var dbHost="linus.mongohq.com";
var dbPort=10022;
var db_name="mxdemo";
var dbUser="mxuser";
var dbPass="mxusertest";

exports.repo = repo;
repo.init(
    {
        type: 'mongoDb',
        host: dbHost,      // optional
        port: dbPort,            // optional
        dbName: db_name,    // optional
        collectionName: 'user',// optional and only if you directly
                                // want to use a collection,
                                // so repo.extend() is not necessary...
        username: dbUser,       // optional
        password: dbPass        // optional
    },
    function(err) {
        if(err) {
            console.log('ohhh :-(');
            return;
        }
    }
);