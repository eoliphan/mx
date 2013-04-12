var redis = require("redis")
, domain = require("./domain/domain").domain
, conf = require('./config').conf
    , logger = require("./logger")
    ,  _ = require('underscore')
//    , amqpDsl = require("ampq-dsl")
    , amqp = require("amqp")

;
var redisHost = conf.get("redis:host");
var redisPort = conf.get("redis:port");
var redisPass = conf.get("redis:pass");

var evtTopic="domainevent";
var cmdTopic="domaincommand";

//var cmd = redis.createClient(redisPort,redisHost);
//cmd.auth(redisPass,function(val){
//    logger.info("command bus: "+val);
//
//
//});
//var evt = redis.createClient(redisPort,redisHost);
//evt.auth(redisPass,function(val){
//    logger.info("event bus: "+val);
//
//});
//
//var cmdSub = redis.createClient(redisPort,redisHost);
//cmdSub.auth(redisPass,function(val){
//    logger.info("event bus: "+val);
//
//});
//
//var evtSub = redis.createClient(redisPort,redisHost);
//evtSub.auth(redisPass,function(val){
//    logger.info("event bus: "+val);
//
//});

//todo: don't start processing until everyhign is wired up
var eventHandlers = {};
var eventSinks=[];

function handleEvent(event) {
    logger.debug("Handling Event: " + event);
    var handlers = eventHandlers[event.event];
    // send to sinks
    _.each(eventSinks,function(sink,index,list){
       sink(event);
    });
    if(!handlers) {
        logger.warn("No handler registered for: "+event.event);

    } else {
        _.each(handlers, function (handler, index, list) {
            logger.debug("Executing handler for: " + event.event);
            handler(event);

        });
    }
}

//-- rabbit mq for events
var amqpConn = amqp.createConnection({
    host:conf.get("evtbusamqp:host"),
    port:conf.get("evtbusamqp:port"),
    login:conf.get("evtbusamqp:login"),
    password:conf.get("evtbusamqp:password"),
    vhost:conf.get("evtbusamqp:vhost")

});

amqpConn.on('error',function(err){
   logger.error("error logging into amqp: " + err);
});
amqpConn.on('ready',function(){
    logger.info("amqp connection ready");
    amqpConn.queue(evtTopic,
        {
            durable:true
        },
        function(queue){
            logger.info("Event queue initialized: " + queue);
            queue.subscribe({
                ack:true
            },function(message,headers,deliveryInfo){
                //var event = JSON.parse(message);
                handleEvent(message);
                queue.shift();

            });

    });

});



domain.on('event',function(event){
   //console.log('event: ' + JSON.stringify(evt));
    //evt.publish(evtTopic,JSON.stringify(event));
    logger.debug("Event Captured: " + JSON.stringify(event));
    amqpConn.publish(evtTopic,event);

});


// listen to commands from redis and call each callback from subscribers
//cmdSub.on('message', function(channel, message) {
//
//    var command = JSON.parse(message);
//
//    if (channel === 'commands') {
//
//        console.log(colors.green('\nhub -- received command ' + command.command + ' from redis:'));
//        console.log(command);
//
//        cmdSubscriptions.forEach(function(subscriber){
//            subscriber(command);
//        });
//
//    }
//});
//cmdSub.subscribe(cmdTopic);
//
//
//
//
//// listen to events from redis and call each callback from subscribers
//
//evtSub.on('message', function(channel, message) {
//
//    logger.debug("event: " + message);
//    var event = JSON.parse(message);
//
//    if (channel === evtTopic) {
//
//        //console.log(colors.green('\nhub -- received event ' + event.event + ' from redis:'));
//        //console.log(event);
//        handleEvent(event);
////        evtSubscriptions.forEach(function(subscriber){
////            subscriber(event);
////        });
//
//    }
//});
//
//evtSub.subscribe(evtTopic);



module.exports = {
    emitCommand: function(command) {
        logger.debug("handling command"+JSON.stringify(command));
        domain.handle(command);

    },
    onCommand: function(command) {

    },
    emitEvent: function(event) {

    },
    onEvent: function(event) {

    },
    addEventSink:function(handler) { // all events go to sinks
        eventSinks.push(handler);

    },
    addEventSubscriber:function(event,handler){

        if(!eventHandlers[event]) {
            eventHandlers[event]=[];
        }
        eventHandlers[event].push(handler);

    }
}
