var conf = require('nconf'),//todo: migrate all conf usage to this pattern
    aws = require('aws-sdk'),
    async = require('async'),
    _ = require('underscore'),
    path = require('path'),
    fs = require('fs'),
    uuid = require('node-uuid')
    ;
var logger = require('winston');



// -- setup aws
var awsconf = conf.get('aws');
aws.config.update(awsconf);
var s3 = new aws.S3();

s3.createBucket({Bucket: awsconf.bucketName, ACL: "public-read"}, function (err, data) {
    if (err) {
        logger.error("Error creating bucket: " + err);
        return;
    }
    logger.info("Created bucket: " + JSON.stringify(data));
});

function getS3PrefixUrl(bucket,region) {
    //"http://sscry.s3-website-us-east-1.amazonaws.com/"
    return "http://"+bucket+".s3-website-"+region+".amazonaws.com/"
}

exports.store = function (file, identifier,contentType, cb) {
    //var filePath = path.join(toProcessDir, file);
    var ext = path.extname(file);
    var fileStr = fs.createReadStream(file);
    var filename = uuid.v4() + ext;
    s3.putObject({Bucket: awsconf.bucketName, Key: filename, ACL: "public-read", ContentType: contentType, Body: fileStr}, function (err, data) {
        if (err) {
            console.log("Error pushing file to S3" + err);
            cb(err);

            return;
        }
        logger.info("File pushed to S3: " + JSON.stringify(data));
        //var fullPath = bucketUrl + file;
        cb(null,getS3PrefixUrl(awsconf.bucketName,awsconf.region)+filename);
        fs.unlink(file, function (err) {
            if (err) {
                logger.error( + err.message + " deleting" + file);
            }
            logger.info("Removed: " + file);
        });

    });


    //return url;
}