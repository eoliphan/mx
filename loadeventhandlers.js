var evtcmdbus = require('./evtcmdbus'),
    _ = require('underscore'),
    //user = require("./user"),
    logger = require("winston"),
    fs = require('fs'),
    async = require('async')
;

var evtHandlerDir = "./eventhandlers";

fs.readdir(evtHandlerDir,function(err,files){
    if (err) return;
    var jsFiles = _.filter(files,function(filename){
        var patt = new RegExp(".*\.js$");
        return patt.test(filename);

    });
    _.each(jsFiles,function(element,index,list){
        var fullPath = evtHandlerDir + "/" + element;
       //logger.debug("processing handlers in: " + fullPath);
        var evtModule = require(fullPath);
        var handlers = _.functions(evtModule);
        _.each(handlers,function(element,index,list){
            //logger.debug("handler: " + element + " : function: " + evtModule[element] );
            evtcmdbus.addEventSubscriber(element,evtModule[element]);
        });
    });

});


//var funcs = _.functions(user);
//_.each(funcs,function(element,index,list){
//    logger.debug(element);
//    logger.debug(user[element]);
//
//});