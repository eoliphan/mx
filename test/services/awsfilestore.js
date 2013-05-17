var nconf = require("nconf");
nconf.use('file', { file: './confval.json' });

nconf.load(function (err, data) {
    //console.log(err);
});
nconf.set("aws:bucketName", "testsscrybuck");
var assert = require('assert');
var uuid = require("node-uuid");
var fs = require("fs");
var request = require('request');
var tmp = require("tmp");
tmp.setGracefulCleanup();
// setup test bucket

var awsfilestore = require("../../services/awsfilestore");


describe('awsfilestore', function () {
    describe('store', function () {
        it('should create a file one s3', function (done) {
            var fileData = uuid.v4();
            var fileName = uuid.v4();
            tmp.file(function (err, path) {
                console.log(path);
                fs.writeFileSync(path, fileData);
                awsfilestore.store(path, fileName, function (err, url) {


                    console.log(url);
                    request(url, function (error, response, body) {

                        assert.ifError(error, "Error from S3 Url");
                        assert.equal(response.statusCode, 200, "HTTP Status should be 200");
                        assert.equal(body, fileData, "Returned data should match what was saved");

                        done();


                    });


                });

            });
        });
    });

});



